"use server";
import ViewClient from "../viewClient"

async function getData(id) {

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    const res = await fetch(`${baseUrl}/api/profile-view/${id}`, {
        cache: "no-store"
    });

    const data = await res.json();

    if (data?.profile) {
        const profile = data?.profile;
        const settings = data?.profile?.settings;
        return { profile, settings };
    }

    return null;
}

export default async function ViewProfile({ params }) {

    const { profile, settings } = await getData(params.id);
    return (
        <ViewClient profile={profile} profSettings={settings} />
    )
}