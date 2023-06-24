import messages from './tag-messages.js';
export default [
    { tag: 'custom', intlLabel: messages.custom, type: 'custom', func: (library) => {
        library.select(''); // selects custom extension since it's id is ''
    } },
    { tag: 'divider1', intlLabel: messages.scratch, type: 'divider' },
    { tag: 'penguinmod', intlLabel: messages.penguinmod },
    { tag: 'turbowarp', intlLabel: messages.turbowarp },
    { tag: 'scratch', intlLabel: messages.scratch },
    { tag: 'divider2', intlLabel: messages.scratch, type: 'divider' },
    { tag: 'categoryexpansion', intlLabel: messages.categoryexpansion },
    { tag: 'programminglanguage', intlLabel: messages.programminglanguage },
];
