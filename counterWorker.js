
// listen to 'message' event from the main thread
globalThis.onmessage = async (event) => {
    // get data from the main thread post
    const { text } = event.data;

    // check browser locale
    const clientLocale = navigator && navigator.languages;

    // count letters
    const letterCounter = (text, locale = "en") => {    
        let count = 0;
        const segmenter = new Intl.Segmenter(locale, {granularity: "grapheme"});
        const letterSegments = segmenter.segment(text);
        // 'u' flag adds Unicode support
        // '\p{L}' pattern matches any letter from any language
        const isLetter = /\p{L}/u;
        
        for (const { segment } of letterSegments) {
            if(isLetter.test(segment)) {
                ++count;
            }
        }

        return count;
    };

    // count words
    const wordCounter = (text, locale = "en") => {    
        let count = 0;
        const segmenter = new Intl.Segmenter(locale, {granularity: "word"});
        const wordSegments = segmenter.segment(text);
        
        for (const element of wordSegments) {
            if(element.isWordLike) {
                ++count;
            }
        }

        return count;
    };

    // count sentences
    const sentenceCounter = (text, locale = "en") => {    
        let count = 0;
        const segmenter = new Intl.Segmenter(locale, {granularity: "sentence"});
        const sentenceSegments = segmenter.segment(text);
        
        // check if a segment ends with sentence-ending punctuation [.!?]
        // and is followed by optional quotes/brackets and whitespace [)\]"'’”]
        const isSentence = /[.!?][)\]"'’”]*\s*$/;

        // check if a segment contains ONLY whitespaces/newlines to discard them
        const isContent = /\p{L}|\p{N}/u;

        // for..of used for performance
        // unlike Array.from() does not create an object for each segment
        for (const { segment } of sentenceSegments) {
            if(isSentence.test(segment) && isContent.test(segment)) {
                ++count;
            }
        }

        return count;
    };


    const letterCount = letterCounter(text, clientLocale);
    const wordCount = wordCounter(text, clientLocale);
    const sentenceCount = sentenceCounter(text, clientLocale);

    // send results back to main thread
    globalThis.postMessage({letterCount, wordCount, sentenceCount});
};
