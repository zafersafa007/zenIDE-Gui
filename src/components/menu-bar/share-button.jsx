import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import Button from '../button/button.jsx';

import styles from './share-button.css';

const API_URL = "https://projects.penguinmod.site/api/";
const PROJECTS_URL = "https://projects.penguinmod.site/";

function authenticate() {
    return new Promise((resolve, reject) => {
        const login = window.open(
            `https://auth.itinerary.eu.org/auth/?redirect=${btoa(window.location.origin)}&name=PenguinMod`,
            "Scratch Authentication",
            `scrollbars=yes,resizable=yes,status=no,location=yes,toolbar=no,menubar=no,width=768,height=512,left=200,top=200`
        );
        if (!login) {
            reject("PopupBlocked");
        }
        let cantAccessAnymore = false;
        let finished = false;
        let interval = null;
        interval = setInterval(() => {
            if (login?.closed && (!finished)) {
                clearInterval(interval);
                try {
                    login.close();
                } catch {
                    // what a shame we couldnt close the window that doesnt exist anymore
                }
                reject("PopupClosed");
            }
            try {
                const query = login.location.search;
                if (!cantAccessAnymore) return;
                const parameters = new URLSearchParams(query);
                const privateCode = parameters.get("privateCode");
                finished = true;
                clearInterval(interval);
                setTimeout(() => {
                    login.close();
                }, 1000);
                resolve(privateCode);
            } catch {
                // due to strange chrome bug, window still has the previous url on it so we need to wait until we switch to the auth site
                cantAccessAnymore = true;
                // now we cant access the location yet since the user hasnt left the authentication site
            }
        }, 10);
    })
}

const ShareButton = ({
    className,
    isShared,
    onClick
}) => (
    <Button
        className={classNames(
            className,
            styles.shareButton,
            { [styles.shareButtonIsShared]: isShared }
        )}
        onClick={onClick}
    >
        <FormattedMessage
            defaultMessage="Upload"
            description="Label for project share button"
            id="gui.menuBar.pmshare"
        />
    </Button>
);

ShareButton.propTypes = {
    className: PropTypes.string,
    isShared: PropTypes.bool,
    onClick: PropTypes.func
};

const getProjectThumbnail = () => {
    return new Promise((resolve, reject) => {
        window.vm.renderer.requestSnapshot(uri => {
            resolve(uri);
        })
    })
}
const getProjectUri = () => {
    return new Promise((resolve, reject) => {
        window.vm.saveProjectSb3().then(blob => {
            return new Promise(resolve => {
                const reader = new FileReader();
                reader.onload = element => {
                    resolve(element.target.result);
                }
                reader.readAsDataURL(blob);
            })
        }).then(resolve);
    })
}

window.addEventListener("message", async (e) => {
    if (!e.origin.startsWith(`https://home.penguinmod.site`)) {
        return;
    }

    if (!e.data.p4) {
        return
    }

    const packagerData = e.data.p4;
    if (packagerData.type !== 'validate') {
        return;
    }

    const imageUri = await getProjectThumbnail();
    e.source.postMessage({
        p4: {
            type: 'image',
            uri: imageUri
        }
    }, e.origin);
    const projectUri = await getProjectThumbnail();
    e.source.postMessage({
        p4: {
            type: 'project',
            uri: projectUri
        }
    }, e.origin);
    e.source.postMessage({
        p4: {
            type: 'finished'
        }
    }, e.origin);
})

ShareButton.defaultProps = {
    onClick: (e) => {
        if (e.shiftKey && e.ctrlKey) {
            // testing for new upload system
            const url = location.origin;
            window.open(`https://home.penguinmod.site/upload?name=${encodeURIComponent(projectName)}&external=${url}`, "_blank");
            return;
        }
        const savedCode = "";
        (function () {
            return new Promise((resolve, reject) => {
                fetch(API_URL + "users/usernameFromCode?privateCode=" + savedCode).then(res => res.json().then(json => {
                    if (json.error != null) {
                        authenticate().then(privateCode => {
                            fetch(API_URL + "users/login?privateCode=" + privateCode).finally(() => {
                                resolve(privateCode)
                            })
                        }).catch(() => resolve(""))
                        return
                    }
                    resolve(savedCode)
                }).catch(() => resolve(""))).catch(() => {
                    resolve("")
                })
            })
        })().then(privateCode => {
            fetch(API_URL + "users/usernameFromCode?privateCode=" + privateCode).then(res => {
                return new Promise((resolve, reject) => {
                    res.json().then(json => {
                        resolve(json.username)
                    })
                })
            }).then(username => {
                window.vm.renderer.requestSnapshot(uri => {
                    fetch(API_URL + "users/store", {
                        "method": "POST", "body": JSON.stringify({
                            container: username,
                            token: privateCode,
                            key: "projectThumbnail",
                            value: String(uri)
                        }), "headers": { "Content-Type": "application/json" }
                    }).finally(() => {
                        window.vm.saveProjectSb3().then(blob => {
                            return new Promise(resolve => {
                                const reader = new FileReader();
                                reader.onload = element => {
                                    resolve(element.target.result)
                                }
                                reader.readAsDataURL(blob)
                            })
                        }).then(dataUri => {
                            fetch(API_URL + "users/store", {
                                "method": "POST", "body": JSON.stringify({
                                    container: username,
                                    token: privateCode,
                                    key: "projectUpload",
                                    value: String(dataUri)
                                }), "headers": { "Content-Type": "application/json" }
                            }).finally(() => {
                                let _projectName = document.title.split(" - ")
                                _projectName.pop()
                                const projectName = _projectName.join(" - ")
                                const filler = Array.from(Array(768).keys()).map(() => { return Math.round(Math.random() * 9) }).join("")
                                // filler text to hopefully hide any privateCodes if the user is recording or something
                                const newTab = window.open(`${PROJECTS_URL}projects/upload?name=[${JSON.stringify(projectName)}]&rt=[${filler}]&privateCode=${privateCode}#`, "_blank")
                            })
                        })
                    })
                });
            })
        })
    }
};

export default ShareButton;
