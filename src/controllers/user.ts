import { UserService } from "../db/user"
import { userSchema } from "../schemas/userSchema"
import { z } from "zod";

type User = z.infer<typeof userSchema>;

class UserController{
    service:UserService;
    constructor(service:UserService){
        this.service = service;
    }
    async createUser(userData:User){
        if(await this.service.findEmail(userData.email)){
            throw(new Error("Email already has an associated account"));
        }
        this.service.createUser(userData);
    }
}

export default UserController;