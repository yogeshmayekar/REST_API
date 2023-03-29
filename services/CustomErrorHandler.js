class CustomErrorHandler extends Error {    //extended the javaScript inbild error handler
    constructor(status, msg){
        super(CustomErrorHandler)
        this.status = status;
        this.message=msg;
    }
    //static method where message has been recived from register controler 1.2
    static alreadyExist(message){
        return new CustomErrorHandler(409, message);
    }
}

export default CustomErrorHandler;