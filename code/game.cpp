#include <bits/stdc++.h>
#define pb push_back
using namespace std;

typedef vector<int> VI;
typedef vector<VI> VVI;
typedef vector<VVI> VVVI;


VVVI boards;
vector <string> usernames;
vector <function<pair<int, int> (VVI)> > shooters;
vector <int> scores;
mt19937 rng(chrono::steady_clock::now().time_since_epoch().count());


void fight(int id1, int id2) {
    int ids[] = {id1, id2};
    VVI board[2]; board[0] = boards[id1]; board[1] = boards[id2];
    VVVI board1(2, VVI(10, VI(10, 3))); // 0 empty, 1 head, 2 body, 3 = unknown
    vector <function<pair<int, int> (VVI)> > shooter(2); shooter[0] = shooters[id1]; shooter[1] = shooters[id2];
    VI destroyed(2, 0);
    int winner = 0;
    for (int turn = rng()%2, turnCount = 1;; turn^=1, turnCount++) {
        int x, y; tie(x, y) = shooter[turn](board1[turn]);
        board1[turn][x][y] = board[turn^1][x][y];
        if (board[turn^1][x][y] == 2) {
            if (++destroyed[turn] == 3) {
                winner = turn;
                break;
            }
        }
        if (board[turn^1][x][y] != 0) {
            turn ^= 1;
            turnCount--;
            continue;
        }
    }
    cout << usernames[ids[winner]] << " won!!!\n";
}
signed main() {
    // inside codes.txt
    {
        function<pair<int, int> (vector<vector<int>>)> shooter = [&](VVI board) {
            for (int i = 0; i < 10; i++)
            for (int j = 0; j < 10; j++)
                if (board[i][j] == 3) return make_pair(i, j);
            return make_pair(-1, -1);
        };
        shooters.pb(shooter);
    }
    // boards should be inside boards.txt, usernames should be inside usernames.txt
    freopen("0.out", "w", stdout);
    ifstream getBoard("../data/boards.txt"), getUsername("../data/usernames.txt");
    int n; getBoard >> n;
    for (int p = 0; p < n; p++) {
        VVI curBoard(10, VI(10));
        for (int i = 0; i < 10; i++)
        for (int j = 0; j < 10; j++) getBoard >> curBoard[i][j];
        boards.pb(curBoard);
    }
    getUsername >> n;
    for (int p = 0; p < n; p++) {
        string s; getUsername >> s;
        usernames.push_back(s);
    }
    for (int t = 0; t < 10; t++)
    for (int i = 0; i < n; i++) 
    for (int j = i+1; j < n; j++) { 
        fight(i, j);
        // cout << i+1 << ' ' << j+1 << " done\n"; 
    }
    
}