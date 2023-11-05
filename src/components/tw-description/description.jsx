import React from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';

import styles from './description.css';
import {render} from 'PenguinMod-MarkDown';

class Renderer {
    constructor (options) {
        this.options = options || {};
    }

    code (code) {
        return (
            <pre>
                <code>
                    {code}
                </code>
            </pre>
        );
    }

    blockquote (quote) {
        return (<blockquote>{quote}</blockquote>);
    }

    html (html) {
        return html;
    }

    heading (text, level) {
        switch (level) {
        case 1:
            return (<h1>{text}</h1>);
        case 2:
            return (<h2>{text}</h2>);
        case 3:
            return (<h3>{text}</h3>);
        case 4:
            return (<h4>{text}</h4>);
        case 5:
            return (<h5>{text}</h5>);
        case 6:
            return (<h6>{text}</h6>);
        }
    }

    hr () {
        return (<hr />);
    }

    list (body, ordered, taskList) {
        const css = taskList
            ? styles.taskList
            : null;
        return (ordered
            ? (<ol className={css}>{body}</ol>)
            : (<ul className={css}>{body}</ul>));
    }

    listitem (text, checked) {
        if (typeof checked === 'undefined') {
            return (<li>{text}</li>);
        }

        return (
            <li className={styles.taskListItem}>
                <input
                    type="checkbox"
                    className={styles.taskListItemCheckbox}
                    checked={checked}
                />
                {text}
            </li>
        );
    }

    paragraph (text) {
        return (<p>{text}</p>);
    }

    table (header, body) {
        return (
            <table>
                <thead>
                    {header}
                </thead>
                <tbody>
                    {body}
                </tbody>
            </table>
        );
    }

    tablerow (content) {
        return (<tr>{content}</tr>);
    }

    tablecell (content, flags) {
        const alignment = flags.align
            ? `text-align:${flags.align}`
            : null;

        return (flags.header
            ? <th style={alignment}>{content}</th>
            : <td style={alignment}>{content}</td>);
    }

    // span level renderer
    strong (text) {
        return (<strong>{text}</strong>);
    }

    em (text) {
        return (<em>{text}</em>);
    }

    codespan (text) {
        return (<code>{text}</code>);
    }

    br () {
        return (<br />);
    }

    del (text) {
        return (<del>{text}</del>);
    }

    link (href, title, text) {
        if (this.options.sanitize) {
            let prot;
            try {
                prot = decodeURIComponent(unescape(href))
                    .replace(/[^\w:]/g, '')
                    .toLowerCase();
            } catch (err) {
                return '';
            }
            if (
                // eslint-disable-next-line no-script-url
                prot.indexOf('javascript:') === 0 ||
                prot.indexOf('vbscript:') === 0 ||
                prot.indexOf('data:') === 0
            ) {
                // eslint-disable-line no-script-url
                return '';
            }
        }
        
        return (
            <a
                href={href}
                title={title}
            >
                {text}
            </a>
        );
    }

    image (href, title, text) {
        return (
            <img
                src={href}
                alt={text}
                title={title}
            />
        );
    }

    text (text) {
        return text;
    }

    project (id) {
        return (
            <a
                href={`https://studio.penguinmod.com/#${id}`}
            >
                {`#${id}`}
            </a>
        );
    }

    mention (name) {
        return (
            <a
                href={`https://penguinmod.com/profile?user=${name}`}
            >
                {`@${name}`}
            </a>
        );
    }

    emoji (name) {
        return (
            <img
                src={`https://library.penguinmod.com/files/emojis/${name}.png`}
                alt={name}
                title={`:${name}:`}
                className={styles.emoji}
            />
        );
    }
}

const decorate = text =>
    render(text, {
        renderer: new Renderer()
    });

const Description = ({
    instructions,
    credits
}) => instructions !== 'unshared' && credits !== 'unshared' && (
    <div className={styles.description}>
        {instructions ? (
            <div>
                <h2 className={styles.header}>
                    <FormattedMessage
                        defaultMessage="Instructions"
                        description="Header for instructions section of description"
                        id="tw.home.instructions"
                    />
                </h2>
                {decorate(instructions)}
            </div>
        ) : null}
        {instructions && credits ? (
            <div className={styles.divider} />
        ) : null}
        {credits && (
            <div>
                <h2 className={styles.header}>
                    <FormattedMessage
                        defaultMessage="Notes and Credits"
                        description="Header for notes and credits section of description"
                        id="tw.home.credit"
                    />
                </h2>
                {decorate(credits)}
            </div>
        )}
    </div>
);

Description.propTypes = {
    instructions: PropTypes.string,
    credits: PropTypes.string
};

export default Description;
