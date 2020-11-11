const express = require('express');
const app = express();
const Joi = require('joi');

app.use(express.json());

const mentors = [
    {
        id:1,
        name:"Arghya",
        company:"HealthifyMe",
        availabilityHours: 6,
        mentees:[1,3]
        
    },{
        id:2,
        name:"Mrigank",
        company:"Visa",
        availabilityHours: 8,
        mentees:[]
    },
    {
        id:3,
        name:"Sandeep",
        company:"Ajio",
        availabilityHours: 7,
        mentees:[]
    }

];

const mentees = [
    {
        id:1,
        name:"Deepak"
    },{
        id:2,
        name:"Rabindra"
    },{
        id:3,
        name:"Subham"
    },
];


const sessions = [
    {
        id:1,
        mentorId:1,
        menteeId:1,
        duration:60,
        startTime: 11
    },{
        id:2,
        mentorId:1,
        menteeId:3,
        duration:60,
        startTime: 12
    }
];

//MENTOR SECTION

app.get("/api/v1/mentors", (req,res)=>{
    res.send(mentors);
})

app.get("/api/v1/mentors/:id", (req,res)=>{

    let id = req.params.id;
    let mentor = mentors.find(el => el.id === parseInt(id));

    if(!mentor){
        res.status(404).send(`Mentor with id ${id} not found`);
        return;
    }
    res.send(mentor);
})

app.post("/api/v1/mentors",(req,res)=>{

    //console.log(req.body);

    const schema = Joi.object({
        name:Joi.string().min(1).required(),
        company:Joi.string().min(1).required(),
        availabilityHours:Joi.number().integer().min(1).required(),
    }); 

    const validationObject = schema.validate(req.body);
    console.log(validationObject);
    
    if(validationObject.error){
        res.status(400).send(validationObject.error.details[0].message);
        return;
    }

    const mentor = {
        id:mentors[mentors.length-1].id +1 ,
        //id: mentors.length+1,// will cause problem when delete as id for 3 elements 
        //if 2nd one deleted then length is 2 but last id is 3 so 2 elements will have same id of 3
        ...req.body
    }
    mentors.push(mentor);

    res.send(mentor);
})

app.put("/api/v1/mentors/:id",(req,res)=>{

    const schema = Joi.object({
        name:Joi.string().min(1).required(),
        company:Joi.string().min(1).required(),
        availabilityHours:Joi.number().integer().min(1).required()
    }); 

    const validationObject = schema.validate(req.body);
    console.log(validationObject);
    
    if(validationObject.error){
        res.status(400).send(validationObject.error.details[0].message);
        return;
    }

    const id = req.params.id;

    const mentorIndex = mentors.findIndex(mentor => mentor.id === parseInt(id));
    //console.log(mentorIndex);

    if(mentorIndex === -1){
        const mentor = {
            id:mentors[mentors.length-1].id +1 , //get last id and add 1 
            ...req.body
        };
        mentors.push(mentor);
        res.send(mentor);
        return;
    }

    const mentor={
        id: parseInt(id),
        ...req.body
    }

    mentors.splice(mentorIndex, 1, mentor);

    res.send(mentor);
})

app.patch("/api/v1/mentors/:id",(req,res)=>{
    
    const id = req.params.id;

    const schema = Joi.object({
        name:Joi.string().min(1),
        company:Joi.string().min(1),
        availabilityHours:Joi.number().integer().min(1)
    });

    const validationObject = schema.validate(req.body);

    if(validationObject.error){
        res.status(400).send(validationObject.error.details[0].message);
        return;
    }

    const mentorIndex = mentors.findIndex(el=> el.id === parseInt(id));

    if(mentorIndex === -1) {
        res.status(404).send("Mentor not found");
        return;
    }

    let getMentor = mentors.find(mentor=> mentor.id === parseInt(id));
    //console.log(getMentor);

    let changeMentor = {
        ...getMentor,
        ...req.body
    }
    //console.log(changeMentor);

    mentors.splice(mentorIndex ,1, changeMentor);

    res.send(changeMentor);
})

app.delete("/api/v1/mentors/:id", (req,res)=>{

    const id = req.params.id;
    //if id does not exist, return 404
    const mentorIndex = mentors.findIndex(mentor => mentor.id === parseInt(id));
    if (mentorIndex === -1) {
        res.status(404).send("Mentor not found");
        return;
    }

    const mentor = mentors[mentorIndex];
    mentors.splice(mentorIndex, 1);

    res.send(mentor);
})

//MENTEE SECTION

app.get("/api/v1/mentees", (req,res)=>{
    res.send(mentees);
})

app.get("/api/v1/mentees/:id", (req,res)=>{

    let id = req.params.id;
    let mentee = mentees.find(el => el.id === parseInt(id));

    if(!mentee){
        res.status(404).send(`Mentee with id ${id} not found`);
        return;
    }
    res.send(mentee);
})


//MENTOR-MENTEE

//getting mentees of a mentor
app.get("/api/v1/mentor-mentee/:id/",(req,res)=>{ 

    const mentorId = req.params.id;

    let mentorIndex = mentors.findIndex(el=> el.id === parseInt(mentorId));

    if(mentorIndex === -1){
        res.status(404).send("Mentor not found");
        return;
    }

    res.send(mentors[mentorIndex].mentees);
})

//assigning mentees
app.put("/api/v1/mentor-mentee/:id1/:id2",(req,res)=>{

    const mentorId = req.params.id1;
    const menteeId = req.params.id2;

    let mentorIndex = mentors.findIndex(el=> el.id === parseInt(mentorId));

    if(mentorIndex === -1){
        res.status(404).send("Mentor not found");
        return;
    }

    let menteeIndex = mentees.findIndex(el=> el.id === parseInt(menteeId));

    if(menteeIndex === -1){
        res.status(404).send("Mentee not found");
        return;
    }

    let menteesOfMentor = mentors[mentorIndex].mentees;
    //console.log(menteesOfMentor);

    let checkMentee = menteesOfMentor.find(el => parseInt(el) === parseInt(menteeId));
    //only checking the mentee is assigned for the given mentor whereas I should check whether mentee has been
    //assigned to any mentor or not

    //console.log(checkMentee);

    if(checkMentee){
        res.status(400).send("Mentee already assigned to the mentor");
        return;
    }   

    mentors[mentorIndex].mentees.push(menteeId);
    res.send(mentors[mentorIndex].mentees);
})

//SESSIONS SECTION

app.get("/api/v1/sessions", (req,res)=>{
    res.send(sessions);
})

app.get("/api/v1/sessions/:id", (req,res)=>{
    let id = req.params.id;
    let session = sessions.find(el => el.id === parseInt(id));

    if(!session){
        res.status(404).send(`session with id ${id} not found`);
        return;
    }
    res.send(session);
})

//scheduling a session
app.post("/api/v1/sessions/:id1/:id2", (req, res)=>{
    const mentorId = req.params.id1;
    const menteeId = req.params.id2;

    //for queries
    const duration = req.query.duration;
    const startTime = req.query.startTime;

    //console.log(duration, startTime);

    let mentorIndex = mentors.findIndex(el=> el.id === parseInt(mentorId));

    if(mentorIndex === -1){
        res.status(404).send("Mentor not found");
        return;
    }

    let menteeIndex = mentees.findIndex(el=> el.id === parseInt(menteeId));

    if(menteeIndex === -1){
        res.status(404).send("Mentee not found");
        return;
    }

    //console.log(menteeId, mentorId);

    const session = {
        id: sessions[sessions.length -1].id +1,
        ...req.body,
        ...req.query
    }

    sessions.push(session);

    res.send(session);
})

app.listen(3000, ()=>{
    console.log("server has started at port 3000...");
})