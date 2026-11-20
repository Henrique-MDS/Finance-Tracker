import { translate } from "@/i18n/i18n";
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
            message: translate("settings.uploadMissing")
        };
    };

    const oldUrl = await getUserProfilePic(userId);
    
    if(oldUrl){
        const { error } = await supabase.storage
            .from("Avatars")
            .remove([oldUrl]);
        if (error) {
            console.error(error);
        }
    }

    const { error } = await supabase.storage
        .from("Avatars")
        .upload(path, file, {
            upsert: true,
        });

    if (error) {
        return {
            "success": false,
            "message": translate("settings.uploadError"),
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
            message: translate("settings.uploadUrlError"),
            error: profileError
        };
    }

    return {
        success: true,
        message: translate("settings.uploadSuccess"),
        publicUrl: data.publicUrl
    };
};

const getUserProfilePic = async (userId: string) => {
    const { data, error } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", userId)
        .single();

    if (error || !data?.avatar_url) {
        return null;
    }

    const url = new URL(data.avatar_url);

    const path = url.pathname.replace(
        "/storage/v1/object/public/Avatars/",
        ""
    );

    return path;
};