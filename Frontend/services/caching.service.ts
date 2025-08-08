const CachePrefix = 'https://localhost/';
const CacheKey = (i: string) => `https://localhost/${i}`;

type IdObject = { id: string };

export class CachingService<T extends IdObject> {
    constructor(private cache: Cache) {}

    async initialize() {
        this.length = (await this.cache.keys()).length;
    }

    public get length() {
        return this._cacheSize;
    }

    private set length(value) {
        this._cacheSize = value;
    }

    private _cacheSize: number = 0;

    public async cacheJson(object: T, payload: Blob) {
        var current = await this.cache.match(CacheKey(object.id));
        await this.cache.put(
            CacheKey(object.id),
            new Response(payload, { headers: Object.keysOf(object).map((key) => [key as string, JSON.stringify(object[key])]) })
        );
        if (!current) this.length++;
    }

    public async updateMetadata(object: T) {
        var current = await this.cache.match(CacheKey(object.id));
        if (!current) return;
        var payload = await current.blob();
        await this.cache.put(
            CacheKey(object.id),
            new Response(payload, { headers: Object.keysOf(object).map((key) => [key as string, JSON.stringify(object[key])]) })
        );
        if (!current) this.length++;
    }

    public async getIterator() {
        function* iterator(this: CachingService<T>) {
            for (var key of keys) yield this.transformResult(key);
            return null;
        }
        var keys = [...(await this.cache.keys())].orderBy((x) => Number.parseInt(x.url.replace(CachePrefix, '')));
        return iterator.call(this);
    }

    public async getPayload(object: T) {
        return await (await this.cache.match(CacheKey(object.id)))!.blob();
    }

    public async deleteObject(object: T) {
        await this.cache.delete(CacheKey(object.id));
        this.length--;
    }

    public async clear() {
        var allDeletions = (await this.cache.keys()).map(async (key) => await this.cache.delete(key));
        await Promise.all(allDeletions);
        this.length = 0;
    }

    private async transformResult(key: Request) {
        var response = await this.cache.match(key);
        if (!response) throw new Error('key not found: ' + key.url);
        return Object.fromEntries(
            response.headers.keys().map((key) => [key, JSON.parseOrDefault(response?.headers.get(key)!)])
        ) as T;
    }
}
