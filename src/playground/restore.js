// wrapper to handle errors & be easier
function post(data, reciever) {
    try {
        reciever.postMessage(
            {
                p4: data,
            },
            importLocation
        );
    } catch (e) {
        console.warn("Cannot post message", e);
    }
}

function restore(importLocation) {
    const opener = window.opener || window.parent;
    if (!opener || opener === window) {
        // exit if not found
        console.warn("External import stopped; parent window not found");
        return;
    }
    // when WE get a post
    window.addEventListener("message", (e) => {
        if (e.origin !== importLocation) {
            return;
        }
        const data = e.data && e.data.p4;
        if (!data) {
            return;
        }

        // data: key, value
        if (data.type === "data") {
            localStorage.setItem(String(data.key), String(data.value));
        }

        // we done here
        if (data.type === "finished") {
            alert('All local data has been saved again!');
        }
    });
    post({ type: "validate" });
}

export default restore;