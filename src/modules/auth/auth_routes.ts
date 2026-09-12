import {Router} from "express";
import {z} from "zod";

import {AuthError, login, register, refreshAccessToken} from "./auth_service";


const router = Router();

const authSchema = z.object ({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().optional()
});
router.post("/register", async (req,res)=> {
    const result = authSchema.safeParse(req.body);

    if(!result.success){
        return res.status(400).json({
            message: "Invalid request body",
            error: result.error.flatten()
        });
    }

    try {
        const response = await register(result.data);
        return res.status(201).json(response);
    }catch(error){
        if(error instanceof AuthError && error.code === "EMAIL_IN_USE"){
            return res.status(409).json({
                message: "Email is already in use"
            })
        }
        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

router.post("/login", async (req,res)=> {
    const result =  authSchema
    .pick({
        email: true,
        password: true
    })
    .safeParse(req.body);

      if(!result.success){
        return res.status(400).json({
            message: "Invalid request body",
            errors: result.error.flatten()
        });
      }

      try {
        const response = await login(result.data);
        return res.status(200).json(response);
      }catch(error){
         if(error instanceof AuthError && error.code === "INVALID_CREDENTIALS"){
            return res.status(401).json({
                message: "Invalid email or password"
            });
         }

         return res.status(500).json({
            message: "Internal server error"
         })
      }




});

router.post("/refresh-token", async (req,res)=> {
 const result = z
 .object({
    refreshToken: z.string().min(1)
 }).safeParse(req.body);

   if(!result.success){
    return res.status(400).json({
        message: "Refresh token is required",
        errors: result.error.flatten()
    });
   }

   try {
    const response = await refreshAccessToken(result.data.refreshToken);
    return res.status(200).json(response);
   }catch(error){
       if(error instanceof AuthError && error.code === "INVALID_REFRESH_TOKEN")
            {
                return res.status(401).json({
                    message: "Refresh token have expired"
                });
            }

        if(error instanceof Error && error.name === "JsonWebTokenError"){
            return res.status(401).json({
                message: "Invalid refresh token"
            });
        }
        return res.status(500).json({
            message: "Internal server error"
        });

   }

})




export default router;

