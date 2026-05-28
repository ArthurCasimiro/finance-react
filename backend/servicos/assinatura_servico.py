from modelos.financeiro import Assinatura
from repositorios.assinatura_repositorio import AssinaturaRepositorio

repositorio = AssinaturaRepositorio()

CICLOS_VALIDOS = ["mensal", "anual", "semanal"]


def listar_assinaturas(usuario_id):
    assinaturas = repositorio.listar_por_usuario(usuario_id)
    return [_serializar(a) for a in assinaturas]


def criar_assinatura(usuario_id, nome, valor, ciclo):
    if not nome or not valor or not ciclo:
        return None, "Todos os campos são obrigatórios"

    if ciclo not in CICLOS_VALIDOS:
        return None, f"Ciclo inválido. Use: {', '.join(CICLOS_VALIDOS)}"

    try:
        valor_float = float(valor)
        if valor_float <= 0:
            return None, "O valor deve ser maior que zero"
    except ValueError:
        return None, "Valor inválido"

    assinatura = Assinatura(
        nome=nome,
        valor=valor_float,
        ciclo=ciclo,
        usuario_id=usuario_id
    )
    repositorio.salvar(assinatura)
    return _serializar(assinatura), None


def cancelar_assinatura(assinatura_id, usuario_id):
    assinatura = repositorio.buscar_por_id(assinatura_id, usuario_id)
    if not assinatura:
        return None, "Assinatura não encontrada"
    repositorio.excluir(assinatura)
    return True, None


def _serializar(assinatura):
    return {
        "id": assinatura.id,
        "nome": assinatura.nome,
        "valor": assinatura.valor,
        "ciclo": assinatura.ciclo,
        "ativa": assinatura.ativa
    }
