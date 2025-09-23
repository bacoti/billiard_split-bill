<?php
require __DIR__ . '/../vendor/autoload.php';
use App\Models\GameSession;

$s = GameSession::with('members')->find(1);
if (!$s) {
    echo "no session\n";
    exit;
}
foreach ($s->members as $m) {
    $parseMinutes = function ($time) {
        if (!$time) return 0;
        $parts = explode(':', substr($time, 0, 8));
        $h = isset($parts[0]) ? (int)$parts[0] : 0;
        $mi = isset($parts[1]) ? (int)$parts[1] : 0;
        $s = isset($parts[2]) ? (int)$parts[2] : 0;
        return $h * 60 + $mi + (int)floor($s/60);
    };
    $start = $parseMinutes($m->start_time);
    $end = $parseMinutes($m->end_time);
    if ($end <= $start) $end += 24*60;
    echo $m->name . ': ' . ($end - $start) . PHP_EOL;
}
