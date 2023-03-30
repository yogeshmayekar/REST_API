class CustomErrorHandler extends Error {    //extended the javaScript inbild error handler
    constructor(status, msg){
        super()
        this.status = status;
        this.message=msg;
    }
    //static method where message has been recived from register controler 1.2
    static alreadyExist(message){
        return new CustomErrorHandler(409, message);
    }

    static incorerctCredentials(message="Incorrect Username or Password"){
        return new CustomErrorHandler(401, message);
    }
    
    static incorerctPassword(message="Incorrect Password"){
        return new CustomErrorHandler(401, message);
    }
}

export default CustomErrorHandler;