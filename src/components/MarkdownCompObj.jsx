import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MarkdownCompObj = {
    code({ node, inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || '');
        return !inline && match ?
            (
                <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag='div'
                    {...props}
                >
                    {
                        String(children).replace(/\n$/, "")
                    }
                </SyntaxHighlighter>
            ) : (
                <code className={className} {...props}>
                    {children}
                </code>
            );
    },
    h1: ({ node, ...props }) => (
        <h1 style={{ fontSize: '2em', fontWeight: 'bold' }} {...props} />
    ),
    h2: ({ node, ...props }) => (
        <h2 style={{ fontSize: '1.5em', fontWeight: 'bold' }} {...props} />
    ),
    h3: ({ node, ...props }) => (
        <h3 style={{ fontSize: '1.1em', fontWeight: 'bold' }} {...props} />
    ),
    strong: ({ node, ...props }) => (
        <>
            <br />
            <strong  {...props} />
        </>
    ),
}

export default MarkdownCompObj;