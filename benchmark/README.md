As with any other benchmarks, this is not representative of real world usage,
most performance slowdowns could be attributed to your *application* code.

```
wrk -t8 -c100 -d30s http://localhost:3030/user/123
```

## srv

```
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     7.72ms    1.90ms  65.80ms   97.59%
    Req/Sec     1.58k   181.22     1.81k    95.58%
  376815 requests in 30.01s, 56.42MB read
Requests/sec:  12556.35
Transfer/sec:      1.88MB

  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     7.48ms  666.36us  21.98ms   95.46%
    Req/Sec     1.61k   152.50     5.76k    95.17%
  385134 requests in 30.10s, 57.66MB read
Requests/sec:  12795.02
Transfer/sec:      1.92MB
```

## polka

```
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     5.96ms    1.92ms  71.87ms   97.50%
    Req/Sec     2.05k   343.31    14.12k    96.29%
  490793 requests in 30.10s, 61.32MB read
Requests/sec:  16306.11
Transfer/sec:      2.04MB

  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     5.71ms  433.68us  17.93ms   87.50%
    Req/Sec     2.11k   125.41     2.37k    78.29%
  504308 requests in 30.01s, 63.00MB read
Requests/sec:  16806.72
Transfer/sec:      2.10MB
```

## express

```
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    25.09ms    5.15ms 103.38ms   91.95%
    Req/Sec   481.31     80.07   606.00     74.38%
  115036 requests in 30.01s, 25.78MB read
Requests/sec:   3832.90
Transfer/sec:      0.86MB

  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    24.19ms    2.62ms  55.28ms   85.24%
    Req/Sec   497.98     53.05   606.00     75.67%
  119029 requests in 30.02s, 26.68MB read
Requests/sec:   3965.63
Transfer/sec:      0.89MB
```
