export type EducationalResourceItem = {
    id: string;
    title: string;
    resourceType: string;
    dateLabel: string;
    url: string;
    imageUrl: string;
};

export const STEADI_BROCHURES: EducationalResourceItem[] = [
    {
        id: 'feet-footwear',
        title: 'Feet and Footwear for Older Adults',
        resourceType: 'Brochure',
        dateLabel: 'August 01, 2024',
        url: 'https://www.cdc.gov/steadi/media/pdfs/2024/08/STEADI_Feet_Footwear_Guide_O.pdf',
        imageUrl: 'https://www.cdc.gov/steadi/images/graphics/keepmoving.jpg',
    },
    {
        id: 'caregiver',
        title: 'Family Caregivers: Protect Your Loved Ones from Falling',
        resourceType: 'Brochure',
        dateLabel: 'August 01, 2021',
        url: 'https://www.cdc.gov/steadi/pdf/steadi-caregiverbrochure.pdf',
        imageUrl: 'https://www.cdc.gov/steadi/images/graphics/helpthemkeepsteadi.png',
    },
    {
        id: 'check-safety',
        title: 'Check For Safety: A Home Fall Prevention Checklist For Older Adults',
        resourceType: 'Info Graphic',
        dateLabel: 'August 01, 2021',
        url: 'https://www.cdc.gov/steadi/pdf/steadi-brochure-checkforsafety-508.pdf',
        imageUrl: 'https://www.cdc.gov/steadi/images/graphics/fallsarepreventable-actionphases.png',
    },
];

export const STEADI_FACT_SHEETS: EducationalResourceItem[] = [
    {
        id: 'stay-independent',
        title: 'Stay Independent: Learn More About Fall Prevention',
        resourceType: 'Fact Sheet',
        dateLabel: 'August 01, 2021',
        url: 'https://www.cdc.gov/steadi/pdf/steadi-brochure-stayindependent-508.pdf',
        imageUrl: 'https://www.cdc.gov/steadi/images/graphics/preventfalls.jpg',
    },
    {
        id: 'what-you-can-do',
        title: 'What You Can Do To Prevent Falls',
        resourceType: 'Fact Sheet',
        dateLabel: 'August 01, 2021',
        url: 'https://www.cdc.gov/steadi/pdf/steadi-brochure-whatyoucando-508.pdf',
        imageUrl: 'https://www.cdc.gov/steadi/images/graphics/reduceyourriskoffalling.jpg',
    },
    {
        id: 'postural-hypotension',
        title: 'Postural Hypotension: What It Is & How to Manage It',
        resourceType: 'Fact Sheet',
        dateLabel: 'August 01, 2021',
        url: 'https://www.cdc.gov/steadi/pdf/steadi-brochure-postural-hypotension-508.pdf',
        imageUrl: 'https://www.cdc.gov/steadi/images/graphics/speak_up-540x540.jpg',
    },
];
