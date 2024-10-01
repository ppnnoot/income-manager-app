const badWordsList: string[] = ['badword1', 'badword2', 'badword3'];

export const hasProfanity = (text: string): boolean => {
    const lowerCaseText = text.toLowerCase();
    return badWordsList.some(badWord => lowerCaseText.includes(badWord));
};

export const censorProfanity = async (text: string): Promise<string> => {
    let censoredText = text;

    for (const badWord of badWordsList) {
        const regex = new RegExp(`\\b${badWord}\\b`, 'gi');
        censoredText = censoredText.replace(regex, '***');
    }

    return censoredText;
};
