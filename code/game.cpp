#include <bits/stdc++.h>
using namespace std;

vector<vector<vector<int>>> boards;
vector <string> usernames;
vector <function<pair<int, int> (vector<vector<int>>)> > shooters;
vector <double> scores;
int all_boards[200][10][10];

void fight(int id1, int id2) {
    int ids[] = {id1, id2};
    vector<vector<int>> board[2]; board[0] = boards[id1]; board[1] = boards[id2];
    vector<vector<vector<int>>> board1(2, vector<vector<int>>(10, vector<int>(10, 3))); // 0 empty, 1 head, 2 body, 3 = unknown
    vector <function<pair<int, int> (vector<vector<int>>)> > shooter(2); shooter[0] = shooters[id1]; shooter[1] = shooters[id2];
    vector<int> destroyed(2, 0);
    int winner = 0;
    /*
        players
        actions
    */
    vector <string> actions;
    int turn = 0, turnCount = 1;
    double score_gained;
    string file_name = "../data/games/" + usernames[id1] + "_VS_" + usernames[id2] + ".txt";
    ofstream output(file_name.c_str());

    for (;; turn^=1, turnCount++) {
        int x, y; tie(x, y) = shooter[turn](board1[turn]);
        board1[turn][x][y] = board[turn^1][x][y];
        actions.push_back(usernames[ids[turn]] + " " + to_string(x) + " " + to_string(y) + " " + to_string(board1[turn][x][y]));
        if (board[turn^1][x][y] == 2) {
            if (++destroyed[turn] == 3) {
                winner = turn;
                score_gained = (120 - (turnCount + 1) / 2) * (1.0 + 1.2 / 3 * (3 - destroyed[turn^1]));
                break;
            }
        }
        if (board[turn^1][x][y] != 0) {
            turn ^= 1;
            turnCount--;
            continue;
        }
    }
    scores[ids[winner]] += score_gained;
    output << actions.size() << '\n';
    for (auto action : actions) output << action << '\n';
    output << usernames[ids[winner]] << " won and gained " << score_gained << " scores!";
    cout << usernames[ids[winner]] << " won and gained " << score_gained << " scores!\n";
}

vector <int> possible, next_possible;
signed main() {
    // inside code.txt
    {
        function<pair<int, int> (vector<vector<int>>)> shooter = [&](vector<vector<int>> board) {
            for (int i = 0; i < 10; i++)
            for (int j = 0; j < 10; j++)
                if (board[i][j] == 3) return make_pair(i, j);
            return make_pair(-1, -1);
        };
        shooters.push_back(shooter);
    }
    // boards should be inside boards.txt, usernames should be inside usernames.txt
    ifstream getBoard("../data/map.txt"), getUsername("../data/user.txt");
    int n; getBoard >> n;
    for (int p = 0; p < n; p++) {
        vector<vector<int>> curBoard(10, vector<int>(10));
        for (int i = 0; i < 10; i++)
        for (int j = 0; j < 10; j++) getBoard >> curBoard[i][j];
        boards.push_back(curBoard);
    }
    getUsername >> n;
    for (int p = 0; p < n; p++) {
        string s; getUsername >> s;
        usernames.push_back(s);
    }
    scores.resize(n+5, 0);
    for (int i = 0; i < n; i++) 
    for (int j = 0; j < n; j++) 
        if (i != j) fight(i, j);
    
    { // broken_bot
        vector<vector<int>> broken_bot_map = {
            {0,0,0,0,2,0,0,1,0,0},
            {0,0,1,1,1,1,1,1,0,1},
            {0,0,0,0,1,0,2,1,1,1},
            {0,0,0,1,1,1,0,1,1,1},
            {0,0,0,0,0,0,1,1,1,0},
            {0,0,0,0,0,0,1,1,1,2},
            {0,0,0,0,0,0,1,0,1,0},
            {0,0,0,0,0,0,0,0,1,0},
            {0,0,0,0,0,0,0,0,0,0},
            {0,0,0,0,0,0,0,0,0,0}
        };
        function <pair <int, int> (vector<vector<int>>)> shooter = [&](vector<vector<int>> board) {
            next_possible.clear();
            vector<vector<int>> guess(10, vector<int>(10, 0)), cur;
            for (int i = 0; i < 10; i++)
            for (int j = 0; j < 10; j++) 
                if (board[i][j] != 3) cur.push_back({i, j, board[i][j]});
            
            for (int& id : possible) {
                bool yes = 1;
                for (auto el : cur) {
                    int a = el[0], b = el[1], c = el[2], d = all_boards[id][a][b];
                    if (c == 0 && d > 0) {
                        yes = 0;
                        break;
                    }
                }
                if (yes) {
                    next_possible.push_back(id);
                    for (int i = 0; i < 10; i++)
                    for (int j = 0; j < 10; j++) {
                        guess[i][j] += (all_boards[id][i][j] > 0 && board[i][j] == 3);
                    }
                }
            }
            int a = 0, b = 0;
            for (int i = 0; i < 10; i++)
            for (int j = 0; j < 10; j++)
                if (guess[i][j] > guess[a][b]) tie(a, b) = make_pair(i, j);
            
            return make_pair(a, b);
        };
        
        usernames.push_back("ThreeMusketeer");
        boards.push_back(broken_bot_map);
        shooters.push_back(shooter);
        ifstream in("../data/broken_bot_helper.txt");
        
        int N; in >> N;
        cout << N << "\n";
        for (int i = 0; i < N; i++) {
            for (int a = 0; a < 10; a++)
            for (int b = 0; b < 10; b++)
                in >> all_boards[i][a][b];
        }
        for (int i = 0; i < n; i++) {
            possible.clear();
            for (int j = 0; j < N; j++) possible.push_back(j);
            fight(n, i);
            possible.clear();
            for (int j = 0; j < N; j++) possible.push_back(j);
            fight(i, n);
        }
    }
    ofstream leaderboardOut("../data/leaderboard.txt");
    vector <pair <double, string> > leaderboard;
    for (int i = 0; i <= n; i++) {
        leaderboard.push_back({-scores[i], usernames[i]});
    }
    sort(leaderboard.begin(), leaderboard.end());
    for (auto [a, b] : leaderboard) {
        leaderboardOut << b << ": " << fixed << setprecision(2) << -a << '\n';
    }
}