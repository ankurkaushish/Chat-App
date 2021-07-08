const users = [];

const addUser = ({id,username,room})=>{
    //clean the data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    //Validate the data
    if(!username || !room )
    {
        return {
            error : "Username and room are required"
        }
    }

    //check for existing user 

    const extUser = users.find((user)=>{
        return user.username === username && user.room === room
    })

    if(extUser)
    {
        return {
            error : "Username in use!"
        }
    }

    //Store the user
    const user = {id,username,room}
    users.push(user)
    return {user};
}

const removeUser = (id) =>{
 const index = users.findIndex((user)=>{
    return  user.id === id
 })

 if(index!=-1)
 {
     return users.splice(index,1)[0]
 }

}
const getUser = (id) =>{
  return users.find((user)=> user.id === id)

}

const getUsersInRoom = (room_name)=>{
    room_name = room_name.trim().toLowerCase()
    return users.filter((user)=> user.room === room_name)
}


module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}