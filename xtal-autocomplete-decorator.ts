import {decorate} from 'trans-render/decorate.js';

export interface IXtalInputOptions {
    data: any[];
    textFld: string;
    keyFld: string;
}

let count = 0;
const auto = '__autoCompletize__';
export function autoCompletize(txt: HTMLInputElement, vals: HTMLInputElement){
    if(txt.hasAttribute(auto)) return;
    txt.setAttribute(auto, '');
    decorate(txt, {
        propVals: vals,
        propDefs: {
            options: undefined,
            selection: undefined,
            lastVal: undefined
        },
        methods:{
            onPropsChange: function(name: string){
                if(name==='selection') return;
                let dl: HTMLDataListElement | null = null;
                if(!this.hasAttribute('list')){
                    const dl = document.createElement('datalist');
                    dl.id = auto + count;
                    count++;
                    this.setAttribute('list', dl.id);
                    dl.style.display='none';
                    document.head.appendChild(dl);
                }
                dl = <any>self[this.getAttribute('list')] as HTMLDataListElement;
                const options = (<any>this).options as IXtalInputOptions;
                const previousOptions = (<any>this)._previousOptions as IXtalInputOptions;
                if(options !== undefined && (options !== previousOptions || this.value !== this._previousValue)){
                    (<any>this)._previousOptions = options;
                    this._previousValue = this.value;
                    const viewableOptions = [];
                    let cnt = 0;
                    const textFld = options.textFld;
                    //let exactlyOneExactMatch = false;
                    let exactMatch = null;
                    const valLC = ((<any>this).value as string).toLowerCase();
                    for(let i = 0, ii = options.data.length; i < ii; i++){
                        const row = options.data[i];
                        if((row[textFld]).toLowerCase().indexOf(valLC) > -1){
                            if(cnt === 0){
                                if(row[textFld] === this.value){
                                    exactMatch = row;
                                }
                            }else{
                                if(row[textFld] === this.value){
                                    exactMatch = null;
                                }
                            }
                            viewableOptions.push(row);
                            cnt++;
                            if(cnt > 20) break;
                        }
                    }
                    if(exactMatch !== null){
                        this.selection = exactMatch;
                        return;
                    }
                    const arr: string[] = [];
                    viewableOptions.forEach(item =>{
                        arr.push(/* html */`<option value="${item[textFld]}">`);
                    })
                    dl.innerHTML = arr.join('');
                }
            },

        },
        on: {
            input: function(e){
                const options = (<any>this).options as IXtalInputOptions
                if(options === undefined) return;
                
                const textFld = options.textFld;
                const item = options.data.find(item => item[textFld] === this.value);
                if (item !== undefined) {
                    this.selection = item;
                }
                this.lastVal = this.value;
            }
        }

    })
}