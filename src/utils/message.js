const generateMessage = (username, text)=>{
  return {
    username : username,
      text : text,
      createdAt : new Date()
  }
}


const generatelocationMessage = (username, url)=>{
    return {
      username : username,
        url : url,
        createdAt : new Date()
    }
  }
  
module.exports = {generateMessage,generatelocationMessage}