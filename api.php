<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dataFile = __DIR__ . '/data.json';
$uploadsDir = __DIR__ . '/uploads';

if (!file_exists($uploadsDir)) {
    mkdir($uploadsDir, 0777, true);
}

function loadData($dataFile) {
    if (!file_exists($dataFile)) {
        return [
            'profile' => [],
            'projects' => [],
            'skills' => []
        ];
    }
    $content = file_get_contents($dataFile);
    $json = json_decode($content, true);
    return is_array($json) ? $json : [];
}

function saveData($dataFile, $data) {
    file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}

$action = $_GET['action'] ?? '';
$type = $_GET['type'] ?? 'all';

// GET request
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $data = loadData($dataFile);
    if ($type === 'profile') {
        echo json_encode($data['profile'] ?? []);
    } elseif ($type === 'projects') {
        echo json_encode($data['projects'] ?? []);
    } elseif ($type === 'skills') {
        echo json_encode($data['skills'] ?? []);
    } else {
        echo json_encode($data);
    }
    exit;
}

// POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 1. Image Upload
    if ($action === 'upload') {
        if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
            echo json_encode(['success' => false, 'error' => 'No image uploaded or upload error']);
            exit;
        }

        $file = $_FILES['image'];
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

        if (!in_array($ext, $allowed)) {
            echo json_encode(['success' => false, 'error' => 'Invalid file format. Allowed: ' . implode(', ', $allowed)]);
            exit;
        }

        $newFileName = 'img_' . time() . '_' . rand(1000, 9999) . '.' . $ext;
        $destination = $uploadsDir . '/' . $newFileName;

        if (move_uploaded_file($file['tmp_name'], $destination)) {
            echo json_encode(['success' => true, 'url' => 'uploads/' . $newFileName]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Failed to save uploaded file']);
        }
        exit;
    }

    // 2. JSON Body Handling
    $rawInput = file_get_contents('php://input');
    $payload = json_decode($rawInput, true);

    if (!$payload && !is_array($payload)) {
        echo json_encode(['success' => false, 'error' => 'Invalid JSON payload']);
        exit;
    }

    $data = loadData($dataFile);

    if ($action === 'save_profile') {
        $data['profile'] = array_merge($data['profile'] ?? [], $payload);
    } elseif ($action === 'save_projects') {
        $data['projects'] = $payload;
    } elseif ($action === 'save_skills') {
        $data['skills'] = $payload;
    } elseif ($action === 'save_all') {
        if (isset($payload['profile'])) $data['profile'] = $payload['profile'];
        if (isset($payload['projects'])) $data['projects'] = $payload['projects'];
        if (isset($payload['skills'])) $data['skills'] = $payload['skills'];
    } else {
        echo json_encode(['success' => false, 'error' => 'Unknown action: ' . $action]);
        exit;
    }

    saveData($dataFile, $data);
    echo json_encode(['success' => true, 'data' => $data]);
    exit;
}
