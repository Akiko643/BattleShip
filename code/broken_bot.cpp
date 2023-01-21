#include <bits/stdc++.h>
#define pb push_back
using namespace std;

typedef vector<int> VI;
typedef vector<VI> VVI;
typedef vector<VVI> VVVI;

short int all_boards[200][10][10];
VI next_possible, possible;
void fight() {
	VVI Board = {
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
    VVI board = {
		{0,0,2,0,0,0,0,2,0,0}, 
		{1,1,1,1,1,1,1,1,1,1}, 
		{0,0,1,0,0,0,0,1,0,0}, 
		{1,1,1,1,1,1,1,1,1,1}, 
		{0,0,0,0,0,0,0,0,0,0}, 
		{0,0,0,0,2,0,0,0,0,0}, 
		{0,0,1,1,1,1,1,0,0,0}, 
		{0,0,0,0,1,0,0,0,0,0}, 
		{0,0,1,1,1,1,1,0,0,0}, 
		{0,0,0,0,0,0,0,0,0,0}
	};
	for (int i = 0; i < 10516; i++) {
		if (board == all_boards[i]) {
			cout << i << "\n";
			exit(0);
		}
	}
    VVI board1(10, VI(10, 3)); // 0 empty, 1 head, 2 body, 3 = unknown
	function <pair <int, int> (VVI)> shooter = [&](VVI board) {
	        next_possible.clear();
	        VVI guess(10, VI(10, 0)), cur;
	        for (int i = 0; i < 10; i++)
	        for (int j = 0; j < 10; j++) 
	            if (board[i][j] != 3) cur.pb({i, j, board[i][j]});
	        
	        for (int& id : possible) {
	            bool yes = 1;
	            for (auto el : cur) {
	                int a = el[0], b = el[1], c = el[2];
	                d = all_boards[id][a][b];
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
    int destroyed = 0;
    int turn = 0, turnCount = 1;
    double score_gained;
    vector <string> actions;
    string file_name = "../data/games/bot_VS_bot.txt";
    ofstream output(file_name.c_str());
    for (;turnCount < 100; turnCount++) {
        int x, y; tie(x, y) = shooter(board1);
        board1[x][y] = board[x][y];
    	cout << "turn: " << turnCount << ' ' << x << ' ' << y << ' ' << board[x][y] << '\n';
        string bot = "bot";
        actions.push_back(bot + " " + to_string(x) + " " + to_string(y) + " " + to_string(board1[x][y]));
        if (board[x][y] == 2) {
            if (++destroyed == 3) {
                score_gained = (120 - (turnCount + 1) / 2);
                break;
            }
        }
        if (board[x][y] != 0) {
            // turnCount--;
            continue;
        }
    }
    output << actions.size() << '\n';
    for (auto action : actions) output << action << '\n';
    output << "bot" << " won and gained " << score_gained << " scores!";
}
signed main() {
	
	ifstream in("../data/broken_bot_helper.txt");
	// freopen("0.out", "w", stdout);
	int n; in >> n;
	for (int i = 0; i < n; i++) {
		possible.pb(i);
		double curDist = 0;
		for (int a = 0; a < 10; a++)
		for (int b = 0; b < 10; b++) 
			in >> all_boards[i][a][b];
	}
    VVI broken_bot_map = {
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
	function <pair <int, int> (VVI)> shooter = [&](VVI board) {
        next_possible.clear();
        VVI guess(10, VI(10, 0)), cur;
        for (int i = 0; i < 10; i++)
        for (int j = 0; j < 10; j++) 
            if (board[i][j] != 3) cur.pb({i, j, board[i][j]});
        
        for (int& id : possible) {
            bool yes = 1;
            for (auto el : cur) {
                int a = el[0], b = el[1], c = el[2];
                if (all_boards[id][a][b] != c) {
                    yes = 0;
                    break;
                }
            }
            if (yes) {
                next_possible.push_back(id);
                for (int i = 0; i < 10; i++)
                for (int j = 0; j < 10; j++) 
                    guess[i][j] += (all_boards[id][i][j] > 0);
            }
        }
        int a = 0, b = 0;
        for (int i = 0; i < 10; i++)
        for (int j = 0; j < 10; j++)
            if (guess[i][j] > guess[a][b]) tie(a, b) = make_pair(i, j);
        
        return make_pair(a, b);
    };
    cout << "HERE\n";
    fight();
}