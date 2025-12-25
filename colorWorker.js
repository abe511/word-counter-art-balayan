
const getRandomShade = (baseHue) => {
    const h = baseHue + (Math.floor(Math.random() * 180) - 90);
    // const h = baseHue + (Math.floor(Math.random() * 80) - 40);
    const s = Math.floor(Math.random() * 30) + 100;
    const l = Math.floor(Math.random() * 30) + 70;
    
    return `hsl(${h}, ${s}%, ${l}%)`;
};


globalThis.onmessage = async (event) => {
    const { base, theme } = event.data;

    const c1 = Math.round(Math.random()) ? getRandomShade(base) : theme;
    const c2 = Math.round(Math.random()) ? getRandomShade(base) : theme;
    const c3 = Math.round(Math.random()) ? getRandomShade(base) : theme;
    const c4 = Math.round(Math.random()) ? getRandomShade(base) : theme;
    const c5 = Math.round(Math.random()) ? getRandomShade(base) : theme;
    const c6 = Math.round(Math.random()) ? getRandomShade(base) : theme;
    const c7 = Math.round(Math.random()) ? getRandomShade(base) : theme;
    const c8 = Math.round(Math.random()) ? getRandomShade(base) : theme;

    const bgColor = `
        radial-gradient(circle, ${theme} 30%, transparent 100%),
        conic-gradient(from ${base}deg, ${c1}, ${c2}, ${c3}, ${c4}, ${c5}, ${c6}, ${c7}, ${c8}, ${c1})
    `;

    globalThis.postMessage({bgColor});
};