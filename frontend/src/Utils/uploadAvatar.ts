import { supabase } from "@/services/supabase";

type UploadAvatarResponse = {
    success: boolean;
    message: string;
    error?: any;
    publicUrl?: string;
}

export const uploadAvatar = async (file:File, path:string, userId: string):Promise<UploadAvatarResponse> => {
    if (!file || !path || !userId){
        return {
            success: false,
            message: "Arquivo, caminho ou ID do usuário não fornecidos"
        };
    };

    const { error } = await supabase.storage
        .from("Avatars")
        .upload(path, file, {
            upsert: true,
        });

    if (error) {
        return {
            "success": false,
            "message": "Erro ao realizar upload da imagem",
            "error": error
        }
    }
    
    const { data } = supabase.storage
        .from("Avatars")
        .getPublicUrl(path);

    const { error: profileError } = await supabase
        .from("profiles")
        .update({
            avatar_url: data.publicUrl,
        })
        .eq("id", userId);

    if(profileError){
        return {
            success: false,
            message: "Erro ao salvar url da imagem",
            error: profileError
        };
    }

    return {
        success: true,
        message: "Upload realizado com sucesso",
        publicUrl: data.publicUrl
    };
};