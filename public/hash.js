self.importScripts('/spark-md5.min.js')
self.onmessage = (e) => {
    const spark = new self.SparkMD5.ArrayBuffer();
    const chunks = e.data;
    const read = new FileReader();
    let count = 0;
    const loadNext = (index) => {
        read.readAsArrayBuffer(chunks[index].file);
        read.onload = (e) => {
            spark.append(e.target.result);
            count++;
            if (count == chunks.length) {
                // console.log(spark.end());
                self.postMessage(spark.end());
                return ;
            }
            loadNext(count);
        }
    }
    loadNext(0);
    // console.log(chunks);
}