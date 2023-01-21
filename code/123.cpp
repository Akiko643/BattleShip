function<pair<int, int> (vector<vector<int>>)> shooter = [&](vector<vector<int>> board) {
    for (int i = 0; i < 10; i++)
    for (int j = 0; j < 10; j++)
        if (board[i][j] == 3) return make_pair(i, j);
    return make_pair(-1, -1);
};