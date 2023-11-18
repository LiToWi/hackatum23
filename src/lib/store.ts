const NAME = 'credentials';

function retrieve(storage: Storage) {
    const { password, id } = JSON.parse(storage.getItem(NAME)!);
    return {
        password,
        id,
    };
}

export function get() {
    try {
        return retrieve(localStorage);
    } catch {
        try {
            return retrieve(sessionStorage);
        } catch {
            return Error('No value found!');
        }
    }
}

export function set(id: string, password: string, isPersistent: boolean) {
    (isPersistent ? localStorage : sessionStorage).setItem(
        NAME,
        JSON.stringify({ id, password })
    );
}

export function remove() {
    localStorage.removeItem(NAME);
}
