#include <cstdio>
#include <ctime>
#include <cstdlib>

using namespace std;

#define maxn 105

int n, m;
const int dx[] = {1,-1,0,0};
const int dy[] = {0,0,1,-1};
int a[maxn][maxn];
int b[maxn][maxn];

bool chk(int x,int y,int dir) {
	if (x < 1 || x > n || y < 1 || y > m) return 0;
	if (!a[x][y]) return 0;
	if (dir != 0 && x > 1 && !a[x-1][y]) return 0;
	if (dir != 1 && x < n && !a[x+1][y]) return 0;
	if (dir != 2 && y > 1 && !a[x][y-1]) return 0;
	if (dir != 3 && y < m && !a[x][y+1]) return 0;
	return 1;
}

void fill(int x,int y,int dir) {
	if (!chk(x,y,dir)) return;
	a[x][y] = 0;
	while (1) {
		int p = rand() % 4;
		int q = rand() % 8;
		if (q > 1 || p == (dir^1)) p = dir;
		fill(x + dx[p], y + dy[p], p);
		if (rand() % 50 <= 10) break;
	}
}

bool fill2(int x,int y,int dir) {
	if (x < 1 || x > n || y < 1 || y > m) return false;
	if (!a[x][y]) return true;
	a[x][y] = 0;
	while (1) {
		int p = rand() % 4;
		int q = rand() % 8;
		if (q > 1 || p == (dir^1)) p = dir;
		if (fill2(x+dx[p], y+dy[p], p))
			return true;
	}
	return false;
}

int main() {
	
	freopen("map.out","w",stdout);
	
	srand(unsigned(time(0)));

	n = m = 20;
	int tot = -1;
	for (int i = 0; i <= n+1; i++)
		for (int j = 0; j<=m+1; j++)
		{
			a[i][j] = 1;
			b[i][j] = ++tot;
		}
	
	int st, en;
	
	st = rand() % m + 1;
	en = (n+1)*(m+2) + rand() % m + 1;

	fill(1, st, 0);
	fill2(n, en - (n+1)*(m+2), 1);

	printf("MaxX=%d;\nMaxY=%d;\n",n+2,m+2);
	puts("Map=[];");
	tot = -1;
	for (int i = 0; i <= n+1; i++) {
		printf("Map[%d]=[",i);
		for (int j = 0; j <= m; j++)
		{
			tot++;
			if (tot == st) putchar('0');
			else if (tot == en) putchar('0');
			else printf("%d",a[i][j]);
			putchar(',');
		}
		tot++;
		printf("%d];\n",a[i][m+1]);
	}
	printf("myX=%d;\nmyY=%d;\nmyZ=%d;\n",0,1,st);
	printf("endX=%d;\nendY=%d;\nendZ=%d;\n",n + 1, 1, en - (n+1)*(m+2));
	return 0;
	
}
