As with any other benchmarks, this is not representative of real world usage,
most performance slowdowns could be attributed to your *application* code.

## GET request

```
wrk -t8 -c100 -d30s http://localhost:3030/user/123
```

### srv + router

```
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     6.66ms    2.11ms  68.76ms   97.63%
    Req/Sec     1.84k   236.33     2.13k    95.79%
  439995 requests in 30.02s, 65.88MB read
Requests/sec:  14658.65
Transfer/sec:      2.19MB

  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     6.56ms  449.61us  17.91ms   89.37%
    Req/Sec     1.84k   101.71     2.06k    85.38%
  439308 requests in 30.02s, 65.78MB read
Requests/sec:  14634.24
Transfer/sec:      2.19MB
```

### polka

```
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     5.68ms    1.74ms  66.80ms   98.08%
    Req/Sec     2.15k   246.86     2.72k    95.50%
  514567 requests in 30.02s, 64.29MB read
Requests/sec:  17139.35
Transfer/sec:      2.14MB

  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     5.46ms  446.87us  16.19ms   87.69%
    Req/Sec     2.21k   138.88     3.27k    79.50%
  527749 requests in 30.02s, 65.93MB read
Requests/sec:  17578.28
Transfer/sec:      2.20MB
```

### express

```
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    25.03ms    5.71ms 135.22ms   93.24%
    Req/Sec   484.19     79.26   606.00     75.19%
  115673 requests in 30.03s, 25.92MB read
Requests/sec:   3852.19
Transfer/sec:      0.86MB

  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    25.83ms    4.21ms  99.65ms   92.58%
    Req/Sec   467.19     59.19   606.00     82.46%
  111708 requests in 30.02s, 25.04MB read
Requests/sec:   3720.66
Transfer/sec:    853.86KB
```

### koa + koa-router

```
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     7.75ms    2.72ms  72.60ms   97.23%
    Req/Sec     1.59k   223.84     1.82k    95.67%
  380377 requests in 30.02s, 62.39MB read
Requests/sec:  12671.85
Transfer/sec:      2.08MB

  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     7.55ms  775.63us  35.35ms   97.14%
    Req/Sec     1.60k   109.62     1.80k    94.12%
  381677 requests in 30.02s, 62.61MB read
Requests/sec:  12714.80
Transfer/sec:      2.09MB
```
