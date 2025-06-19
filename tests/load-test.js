import http from 'k6/http';
import { check } from 'k6';
import { Counter } from 'k6/metrics';

export const successCount = new Counter('http_200_responses');
export const errorCount = new Counter('http_400_responses');

export const options = {
  vus: 10000,
  iterations: 10000,
};
export default function () {
  const res = http.patch('http://localhost:3000/users/1/balance', JSON.stringify({ amount: 2 }), {
    headers: { 'Content-Type': 'application/json' },
  });

  if (res.status === 200) {
    successCount.add(1);
  } else if (res.status === 400) {
    errorCount.add(1);
  }

  check(res, {
    'is 200 or 400': (r) => r.status === 200 || r.status === 400,
  });
}

