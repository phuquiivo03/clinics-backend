import type { RequestHandler } from "express"
import  { ROLE } from "../types"
import { CustomExpress } from "../pkg/app/response"
import { ErrorCode } from "../pkg/e/code"

export const adminRole: RequestHandler = (req, res, next)=> {
    const appExpress = new CustomExpress(req, res, next)
    try {
        if(!req.user || req.user.role == !ROLE.ADMIN) {
            appExpress.response403(ErrorCode.FORBIDDEN, {})
        }
    }catch(e) {
        appExpress.response401(ErrorCode.UNAUTHORIZED, {})
    }
}