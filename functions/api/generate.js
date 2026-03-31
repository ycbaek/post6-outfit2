export async function onRequestPost(context) {
    const apiKey = context.env.OPENAI_API_KEY;
    if (!apiKey) {
        return new Response(JSON.stringify({ error: 'OPENAI_API_KEY not configured' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const formData = await context.request.formData();
        const image = formData.get('image');
        const prompt = formData.get('prompt');

        const openaiForm = new FormData();
        openaiForm.append('image', image);
        openaiForm.append('prompt', prompt);
        openaiForm.append('model', 'gpt-image-1');
        openaiForm.append('n', '1');
        openaiForm.append('size', '1024x1024');
        openaiForm.append('quality', 'auto');

        const response = await fetch('https://api.openai.com/v1/images/edits', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
            },
            body: openaiForm,
        });

        const data = await response.json();

        if (!response.ok) {
            return new Response(JSON.stringify({ error: data.error?.message || 'API error' }), {
                status: response.status,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
