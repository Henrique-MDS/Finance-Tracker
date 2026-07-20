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
        .upload(path, file);

    if (error) {
        return {
            "success": false,
            "message": "Erro ao realizar upload da imagem",
            "error": error
        }
    }

    const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(path);

    return {
        success: true,
        message: "Upload realizado com sucesso",
        publicUrl: data.publicUrl
    };
};