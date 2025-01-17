import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from './env.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
  
  dataList: any;
  topoi: any;
  msg: string;
  body: string;
  wait: number = 0;
  order: number = 0;
  timeoutID: number = 0;
  constructor(private http: HttpClient, private env: EnvService, private cd: ChangeDetectorRef) {
    this.dataList = [];

  }

  ngOnInit(): void {
    this.getData();
/* DISABLED
    setTimeout(() => {
      window.location.reload();
    }, 5000);
*/
  }

  ngOnDestroy() {
    clearTimeout(this.timeoutID);
  }

  getData(): void {
    const that = this;
    this.http
      // .get(`https://run.mocky.io/v3/e98cb9d0-4250-4957-8c8c-5b1d94596d44`)
      .get(this.env.apiUrl + '/json')
      .subscribe((res) => {
        this.dataList = res;
        this.cd.markForCheck();
        clearTimeout(this.timeoutID);
        this.timeoutID = setTimeout(() => {
          that.getData();
        }, 5000);
        // console.log(this.dataList);
      });
  }

  orderEvent(){

    this.http.post(this.env.apiUrl + '/update', `PREFIX ex:<http://example.org/>
    PREFIX pos: <http://example.org/property/position#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    PREFIX st:  <http://example.org/stigld/>
    Prefix point: <http://gridPoint/>
    PREFIX stigFN: <http://www.dfki.de/func#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    
    INSERT{?uri a ex:Order ; ex:created ?created ; ex:status "unassigned"^^xsd:string}
    WHERE{
      BIND(UUID() as ?uri) BIND (NOW() as ?created)
    }
  
    `)        
    .subscribe((res) => {
      //this.dataList = res;
       console.log("Hi");
    });
    console.log("Button Clicked");
/*    location.reload(true); DISABLED */
  }

  

  getRgbColor(obj): string 
  {
    if (obj) 
	  {
      if (obj.machine)
      { 
        this.wait = this.wait+obj.machine.waiting;
        this.order = this.order+obj.machine.orders;
        // console.log("Wait: "+ obj.machine.waiting)
        // console.log("Order: "+ obj.machine.orders)
        if(obj.negFeedback){          
          return `rgb(255,0,0, ${obj.negFeedback/100})`;
        }
        else{
          // console.log("else negFeedback");
          return `rgb(169,169,169)`;  // if machine with no neg feedback, cell is grey
        }
      }
      else if (obj.transporter)
      {
        if (obj.transporter.timeToPickup) 
        {                     
          return `rgb(135,206,250)`;   
        }
        else if(obj.transporter.timeToMove)
        {
          return `rgb(255,242,179)`
        }
        else
          return `rgb(255,165,0)`;        //if transporter wth no time to pick up, cell is orange
      }
      else if (obj.outputPort)
      {
        return `rgb(85, 102, 0)`;
      }
      else if (obj.transportStigma) 
      {
        if(obj.transportStigma >0 && obj.transportStigma < 0.0001)
          return `rgb(0,128,0,0.2)`;   //add green as diffusion trace  color
        else if(obj.transportStigma>0.00001 && obj.transportStigma < 0.0001)
          return `rgb(0,128,0,0.4)`;   //add green as diffusion trace color
        else if(obj.transportStigma>0.0001 && obj.transportStigma < 0.001)
          return `rgb(0,128,0,0.6)`;   //add green as diffusion trace color  
        else if(obj.transportStigma>0.001 && obj.transportStigma < 0.01)
          return `rgb(0,128,0,0.8)`;   //add green as diffusion trace color
        else if(obj.transportStigma>0.01 && obj.transportStigma < 0.1)
          return `rgb(0,128,0,0.9)`;   //add green as diffusion trace color
        else
          return `rgb(0,128,0, 1)`;   //add green as diffusion trace color          
      } 
      else if (obj.diffusionTrace) 
      { 
        if((obj.diffusionTrace==0||obj.diffusionTrace>0) && obj.diffusionTrace < 0.00001)
          return `rgb(0,128,0,0.2)`;   //add green as diffusion trace  color
        else if(obj.diffusionTrace>0.00001 && obj.diffusionTrace < 0.0001)
          return `rgb(0,128,0,0.35)`;   //add green as diffusion trace color
        else if(obj.diffusionTrace>0.0001 && obj.diffusionTrace < 0.001)
          return `rgb(0,128,0,0.55)`;   //add green as diffusion trace color  
        else if(obj.diffusionTrace>0.001 && obj.diffusionTrace < 0.01)
          return `rgb(0,128,0,0.8)`;   //add green as diffusion trace color
        else if(obj.diffusionTrace>0.01 && obj.diffusionTrace < 0.1)
          return `rgb(0,128,0,0.9)`;   //add green as diffusion trace color
        else
          return `rgb(0,128,0, 1)`;   //add green as diffusion trace color    
        
      }
      else
        return `rgb(255,255,255)`;
    }
  }

  // getNumberOfOrders(): number
  // {
  //   console.log("Orders: "+this.order);
  //   return this.order;
  // }
  // getNumberOfWait(): number
  // {
  //   // console.log("Wait: "+this.wait);
  //   return this.wait;
  // }
}


