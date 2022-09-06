const LocalStorageMethods = {
    set:(key:string, value:any) =>{
        console.log('setting', key)
        localStorage.setItem(key, value);
    },
    get:(key:string):string | null => {
        return localStorage.getItem(key);
    },
    delete:(key:string) => {
        localStorage.removeItem(key);
    },
    clear: () => {
        localStorage.clear()
    }
}

export default LocalStorageMethods