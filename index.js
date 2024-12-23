const express = require("express");
const app = express();
const mongoose = require("mongoose")
const cors = require("cors")



app.use(express.json())
app.use(cors({
    origin:["https://react2-frontend.vercel.app","http://localhost:3000"]
}))


try{
    mongoose.connect("mongodb+srv://arjuntudu9163:awHhKuynNRCy47mD@cluster0.cq6wv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
}catch(e){
    if(e){
        console.log("database connection error",e);
    }
}

const Events = mongoose.model("events",{
    
    name :String ,
    orgName:String,
    date :String,
    desc:String,
    images : [],
    going:[]
})

const Organizer = mongoose.model("Organizer",{
   
    name:String,
    password:String,
    re_password:String,
    events:[]

})


app.get("/",async (req,res)=>{
    
    try{
        res.json({"value":"okay"})
    }catch(e){

        if(e){
            console.log(e);
        }
    }

})

app.post("/organizerRegister",async(req,res)=>{
    
    console.log(req.body);

    try{

        const response = await Organizer.create(req.body);
        console.log(response, "<======= register response")
        res.json(response)

    }catch(e){
       
        if(e){
            console.log(e)
        }else{
            console.log("org registered successfully");
        }

    }

})

app.post("/organizerLogin",async(req,res)=>{

    console.log(req.body,"<====== incoming login credentials");

    try{
        
        const response = await Organizer.find({name:req.body.name,password:req.body.password});
        res.json(response)

    }catch(e){
        if(e){
            console.log("organizer find error")
        }
    }

})

app.post("/getOrgName" ,async(req,res)=>{
    
    const id = req.body.id ;

    try{
        
        const response = await Organizer.find({_id:id});

        console.log(response , " <==== organizer response" )

        res.json(response)

    }catch(e){

        console.log("findOrgName error");

    }


})


app.post("/savedEvents",async(req,res)=>{

      try{
           const response = await Events.find({})

      }catch(e){}


})

app.post("/getEvent",async(req,res)=>{

     
      console.log(req.body, "<=== get Event Triggered")

       try{
         
        const response = await Events.find({_id:req.body.id});
        console.log(response , " <===== get event reponse")
        res.json(response)
          
       }catch(e){
         
        if(e){
            console.log(e);
        }

       }

})

app.post("/getEventGoing",async(req,res)=>{
      
    console.log(req.body , "<============ goingggggg")
   

    try{
        const response = await Events.find({_id:req.body.eventId})

        const goingList = response[0].going 

        const response2 = await Events.findOneAndUpdate({_id:req.body.eventId},{
            
            going : [...goingList,req.body.name]

        })
       

        res.json(response2)

    }catch(e){

        console.log(e);
    }
})



app.post("/createEvent",async (req,res)=>{

     console.log(req.body);

     try{
         
        const response = await Events.create(req.body);
        console.log(response , "<===== event created ")



        const orgId = response.orgName
        const eventId = response._id
    

        const responseOfFindOrg = await Organizer.find({_id:orgId});
        console.log(responseOfFindOrg, "< ===== finding org")


        const eventList = responseOfFindOrg[0].events ;
        const adminName = responseOfFindOrg[0].name

        console.log(adminName, " <========= admin name")

        const responseOfAppending = await Organizer.findByIdAndUpdate({_id:orgId},{
            events : [...eventList,response]
        })





       

        const finalOrg = await Organizer.find({})

 
        res.json(finalOrg)





         
    }catch(e){
        
        if(e){
            console.log(e);
        
        }
     }
     
    

})

app.post("/deleteEvent",async(req,res)=>{
    
    console.log(req.body , " <====== eventId response");
    
    try{

        const response = await Events.deleteOne({_id:req.body.eventId})
        console.log(response , "< ===== delete response");
        res.json({"value":response.acknowledged})

    }catch(e){}

    


})



app.get("/getEvents",async(req,res)=>{

      try{

        const response = await Events.find({});
        console.log(response,"<===== all events")
        res.json(response);

      }catch(e){

         if(e){
            console.log(e);
            res.status(404)
         }
      }
});

app.get("/getOrganizers",async (req,res)=>{

    try{
         
        const response = await Organizer.find({});
        
        

        res.json(response)
       
    }catch(e){

       if(e){
         
        console.log("get organizers error")

       }

    }





})



app.listen(5000,(err)=>{
    if(err){
        console.log("app started failed")
    }else{
        console.log("app started successfully")
    }
})
