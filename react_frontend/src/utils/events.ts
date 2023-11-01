/**
 * This module includes some auxiliary
 * functions to fetch and process actions
 * based on user's behavior
 */

import { MouseEvent } from 'react';
import { History } from 'history';


/**
 * Redirects the user to another page.
 * @param ev: Event with the user's actions when an
 *  element is clicked.
 * @param history: History hook to redirect the user.
 * @param path: Redirection path.
 */
export const redirectToPage = (ev: MouseEvent, history: History, path: string): void => {
    const ctrlPressed: boolean = ev.ctrlKey || false;

    // Avoid to redirect the user if CTRL is pressed
    // this means the user wants to open a new page in
    // another tab.
    if (!ctrlPressed) {
        history.push(path);
    }
};