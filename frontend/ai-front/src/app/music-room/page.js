import RadioPageClient from "./RadioPageClient";

async function getRadioData() {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:8000";

        const [countriesRes, tagsRes] = await Promise.all([
            fetch(`${baseUrl}/api/radio/countries`, { next: { revalidate: 3600 } }),
            fetch(`${baseUrl}/api/radio/tags`, { next: { revalidate: 3600 } })
        ]);

        const countriesData = await countriesRes.json();
        const tagsData = await tagsRes.json();

        const countries = countriesData.countries?.slice(0, 400).map(m => m.name) || [];
        const tags = tagsData.tags?.slice(0, 400).map(t => t.name) || [];

        countries.unshift("No country");
        tags.unshift("No tag");

        return { countries, tags };
    } catch (error) {
        console.error("Failed to fetch radio data:", error);
        return { countries: ["No country"], tags: ["No tag"] };
    }
}

export default async function RadioPage() {
    const { countries, tags } = await getRadioData();
    return <RadioPageClient initialCountries={countries} initialTags={tags} />;
}