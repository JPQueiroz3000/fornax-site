<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Verificar se é uma requisição POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método não permitido']);
    exit;
}

// Função para sanitizar dados
function sanitize($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

// Validar e sanitizar dados do formulário
$nome = sanitize($_POST['nome'] ?? '');
$sobrenome = sanitize($_POST['sobrenome'] ?? '');
$email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
$telefone = sanitize($_POST['telefone'] ?? '');
$produto = sanitize($_POST['produto'] ?? '');
$observacoes = sanitize($_POST['observacoes'] ?? '');
$concordo = isset($_POST['concordo']) && $_POST['concordo'] === 'on';

// Validações
$errors = [];

if (empty($nome)) {
    $errors[] = 'Nome é obrigatório';
}

if (empty($sobrenome)) {
    $errors[] = 'Sobrenome é obrigatório';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'E-mail válido é obrigatório';
}

if (empty($telefone)) {
    $errors[] = 'Telefone é obrigatório';
}

if (empty($produto)) {
    $errors[] = 'Produto é obrigatório';
}

if (!$concordo) {
    $errors[] = 'É necessário concordar com os termos';
}

// Se houver erros, retornar
if (!empty($errors)) {
    echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    exit;
}

// Mapear nomes dos produtos
$produtos_map = [
    'frigideira-profissional' => 'Frigideira Profissional',
    'paellera-rasa' => 'Paellera Rasa',
    'frigideira-15cm' => 'Frigideira 15cm'
];

$produto_nome = $produtos_map[$produto] ?? $produto;

// Configurações de e-mail
$to = 'fornax@fornaxutensilios.com';
$subject = 'Cliente Interessado em Utensílio';

// Corpo do e-mail
$message = "
<html>
<head>
    <title>Nova Reserva - Fornax Utensílios</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #d97706; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #d97706; }
        .value { margin-top: 5px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>Nova Reserva de Produto</h2>
            <p>Fornax - Utensílios de Alta Performance</p>
        </div>
        <div class='content'>
            <div class='field'>
                <div class='label'>Nome Completo:</div>
                <div class='value'>{$nome} {$sobrenome}</div>
            </div>
            
            <div class='field'>
                <div class='label'>E-mail:</div>
                <div class='value'>{$email}</div>
            </div>
            
            <div class='field'>
                <div class='label'>WhatsApp:</div>
                <div class='value'>{$telefone}</div>
            </div>
            
            <div class='field'>
                <div class='label'>Produto de Interesse:</div>
                <div class='value'>{$produto_nome}</div>
            </div>
            
            " . (!empty($observacoes) ? "
            <div class='field'>
                <div class='label'>Observações:</div>
                <div class='value'>{$observacoes}</div>
            </div>
            " : "") . "
            
            <div class='field'>
                <div class='label'>Data da Reserva:</div>
                <div class='value'>" . date('d/m/Y H:i:s') . "</div>
            </div>
        </div>
    </div>
</body>
</html>
";

// Headers do e-mail
$headers = [
    'MIME-Version: 1.0',
    'Content-type: text/html; charset=UTF-8',
    'From: noreply@fornaxutensilios.com',
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion()
];

// Tentar enviar o e-mail
if (mail($to, $subject, $message, implode("\r\n", $headers))) {
    // Log da reserva (opcional)
    $log_entry = date('Y-m-d H:i:s') . " - Reserva: {$nome} {$sobrenome} ({$email}) - {$produto_nome}\n";
    file_put_contents('reservas.log', $log_entry, FILE_APPEND | LOCK_EX);
    
    echo json_encode(['success' => true, 'message' => 'Reserva enviada com sucesso']);
} else {
    echo json_encode(['success' => false, 'message' => 'Erro ao enviar e-mail. Tente novamente.']);
}
?>

