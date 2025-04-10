import { NegotiationService } from "../db/negotiation"
import { negotiationSchema } from "../schemas/negotiationSchema";
import { singleClientService } from "../db/client";
import singleUserService from "../db/user";
import { singleProductService } from "../db/product"

class NegotiationController{
    service:NegotiationService;

    constructor(service:NegotiationService){
        this.service = service;
    }
    async getAllNegotiations(){
        return await this.service.getAll();
    }
    async getNegotiationById(id:number){
        return await this.service.getById(id);
    }
    async addNegotiation(negotiationData:unknown, products:any){ // Cambiar a unknown y revisar después
        const parsed = negotiationSchema.safeParse(negotiationData);
        if(!parsed.success) throw new Error("Los datos mandados no cumplen con el schema de negociación")
            
        const negotiationWithDate = {
        ...parsed.data,
        fecha: new Date(parsed.data.fecha),
        };
                    
        const client = await singleClientService.getById(parsed.data.idClientes);
        if (!client) throw new Error(`El cliente de id ${parsed.data.idClientes} no existe`);
        
        const user = await singleUserService.getById(parsed.data.idUsuarios);
        if (!user) throw new Error(`El usuario de id ${parsed.data.idUsuarios} no existe`);

        const newNegotiation = await this.service.create(negotiationWithDate);

        const product = await Promise.all(
            products.map(
                async (prod:any) =>  this.service.createProductRelations({idNegociacion:newNegotiation.id, idProducto:prod.id, cantidad:prod.cantidad, subtotal:prod.cantidad*prod.precio,})
            ))
            
        return newNegotiation;
    }
    async deleteNegotiation(id:number){
        return await this.service.delete(id);
    }
    async updateNegotiation(id:number, newNegotiationData:unknown){
        const parsed = negotiationSchema.safeParse(newNegotiationData);
        if (!parsed.success) throw new Error("Los datos mandados no cumplen con el schema de negociación");

        const negotiationWithDate = {
            ...parsed.data,
            fecha: new Date(parsed.data.fecha),
        };
                    
        const client = await singleClientService.getById(parsed.data.idClientes);
        if (!client) throw new Error(`El cliente de id ${parsed.data.idClientes} no existe`);
        
        const user = await singleUserService.getById(parsed.data.idUsuarios);
        if (!user) throw new Error(`El usuario de id ${parsed.data.idUsuarios} no existe`);

        return await this.service.update(id, negotiationWithDate);
    }
}

export default NegotiationController;