const socket = io()

const message = document.querySelector('#messages')
const $messageTemplate = document.querySelector('#message-template').innerHTML
const $sideBarTemplate = document.querySelector('#sidebar-template').innerHTML


//Query String aka Qs

const {username, room } = Qs.parse(location.search, {ignoreQueryPrefix:true})


//Autoscroll 

const autoscroll=()=>{
    //New Message
    const newMessage = message.lastElementChild

    //Height of the new Message
    const newMessageStyle = getComputedStyle(newMessage)
    const newMessageMargin = parseInt(newMessageStyle.marginBottom)
    const newMessageheight = message.offsetHeight + newMessageMargin

    //Visible Height
    const visibleHeight =message.offsetHeight;

    //Height of Message Container

    const containerHeight = message.scrollHeight

    //How Far i scrolled?

    const scrollOffset  = message.scrollTop + visibleHeight

    if(containerHeight- newMessageheight <= scrollOffset)
    {
        message.scrollTop = message.scrollHeight
    }



}

const $loactionmessageTemplate = document.querySelector('#location-message-template').innerHTML
socket.on('message',(msg)=>{
    // console.log(msg);
    const html = Mustache.render($messageTemplate,{
        username : msg.username,
        message:msg.text,
        createdAt : moment(msg.createdAt).format('h:mm A')
    });
    message.insertAdjacentHTML('beforeend',html);
    autoscroll();
})


document.getElementById('message-form').addEventListener('submit',(e)=>{
    e.preventDefault();
    // const message = document.querySelector('input').value;
    const message = e.target.elements.message.value;

    socket.emit('sendMessage', message, (err)=>{
        if(err){
          return  console.log(err);
        }
        document.querySelector('input').value = ""
        // console.log("Delivered");
    });
})

socket.on('locationMessage',(url)=>{
    console.log(url);
    const html = Mustache.render($loactionmessageTemplate,{
        username : url.username,
        url:url.url,
        createdAt :moment(url.createdAt).format('h:mm A')
    });
    message.insertAdjacentHTML('beforeend',html);
    autoscroll()
})


socket.on('roomData',(d)=>{
    // console.log(d.room)
    // console.log(d.users )

    const html = Mustache.render($sideBarTemplate,{
        room:d.room,
        users:d.users
    })

    document.querySelector('#sidebar').innerHTML = html 
})
 

document.getElementById('send-location').addEventListener('click', ()=>{
    if(!navigator.geolocation)
    {
        alert("The geolocation is not suppoerted by your Browser")
    }

    navigator.geolocation.getCurrentPosition((position)=>
    {
        // console.log(position);
        socket.emit('send-location',{ 
            latitude : position.coords.latitude,
            longitude : position.coords.longitude
        }, ()=>{
            console.log("Location Shared!");
        })
    })
})
// socket.on("countUpdated", (count)=>{
//     console.log("Count Updated "+ count);
// })

// document.getElementById('btn').addEventListener('click', ()=>{
//     console.log("Clicked");
//     socket.emit('increment');
// })

socket.emit('join',{username, room},(error)=>{
    if(error)
    {
        alert(error)
        location.href='/'
    }
})