const amqp = require("amqplib");

const rabbitSettings = {
    protocol: 'amqp',
    hostname: process.env.RABBIT_HOST || 'localhost',
    port: process.env.RABBIT_PORT || 5672,
    username: process.env.RABBIT_USER || 'guest',
    password: process.env.RABBIT_PASSWORD || 'guest',
    vhost: '/',
    authMechanism: ['PLAIN','AMQPLAIN','EXTERNAL']
}

connect();

async function connect(){

    const queue = 'employees';   
    const enterprise = 'facebook';

    try{
        const conn = await amqp.connect(process.env.AMQP_URL || 'amqp://guest:guest@rabbitmq:5672');
        console.log("connection created");

        const channel = await conn.createChannel();
        console.log("channel connected");

        const res = await channel.assertQueue(queue);
        console.log("queue connected");

        console.log(`waiting for messages from ${enterprise}`);
        channel.consume(queue, msg => {   
            let employee = JSON.parse(msg.content.toString());  
            console.log(`Received employee ${employee.name}`);
            console.log(employee);

            // if(employee.enterprise == enterprise){
            //     channel.ack(msg);
            //     console.log("Deleted message from queue...");  

            // }else{
            //     console.log("that Message is not for me i'll not delete it...");
            // }
            channel.ack(msg);
        })

    }catch(err){
        console.error("error",err);
    }
}