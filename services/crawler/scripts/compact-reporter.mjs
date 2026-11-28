export default async function* compactReporter(source) {
    for await (const event of source) {
        if (event.data?.details?.type === 'suite') continue;

        if (event.type === 'test:pass') {
            yield `✔ ${event.data.name}\n`;
        } else if (event.type === 'test:fail') {
            yield `✖ ${event.data.name}\n`;
        }
    }
}
