// Requisito: manter as modalidades disponíveis em um array.
const modalidades = ["Muay Thai", "Jiu-Jitsu", "Boxe", "MMA"];
const modalidadeSelect = document.querySelector("#agendamento-modalidade");

// Requisito: criar dinamicamente as opções antes de ler ou preencher o select.
modalidades.forEach((modalidade) => {
    const option = document.createElement("option");
    option.value = modalidade;
    option.textContent = modalidade;
    modalidadeSelect.append(option);
});

const STORAGE_KEY = "ct-finger-agendamentos";
const form = document.querySelector("#form-aula-experimental");
const appointmentList = document.querySelector("#agendamento-list");
const emptyMessage = document.querySelector("#agendamento-vazio");
const statusMessage = document.querySelector("#agendamento-status");
const formTitle = document.querySelector("#titulo-form-agendamento");
const submitButton = document.querySelector("#agendamento-submit");
const cancelButton = document.querySelector("#agendamento-cancel");
const whatsappContact = document.querySelector('.redes-sociais a[href^="https://wa.me/"]');

let appointments = [];
let editingId = null;

function setStatus(message) {
    statusMessage.textContent = message;        
}

function isAppointment(value) {
    return value !== null
        && typeof value === "object"
        && typeof value.id === "string"
        && typeof value.nome === "string"
        && typeof value.telefone === "string"
        && typeof value.modalidade === "string"
        && typeof value.data === "string";
}

function loadAppointments() {
    try {
        const savedAppointments = localStorage.getItem(STORAGE_KEY);
        if (savedAppointments === null) {
            return [];
        }

        const parsedAppointments = JSON.parse(savedAppointments);
        if (!Array.isArray(parsedAppointments) || !parsedAppointments.every(isAppointment)) {
            throw new Error("Os dados salvos não têm o formato esperado.");
        }

        return parsedAppointments;
    } catch (error) {
        setStatus("Não foi possível carregar os agendamentos salvos neste navegador.");
        form.querySelectorAll("input, select, button").forEach((control) => {
            control.disabled = true;
        });
        return null;
    }
}

function saveAppointments(nextAppointments) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAppointments));
        return true;
    } catch (error) {
        setStatus("Não foi possível salvar. Verifique o armazenamento do navegador e tente novamente.");
        return false;
    }
}

function formatDate(date) {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
}

function createActionButton(label, className, handler) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `button agendamento-action ${className}`;
    button.textContent = label;
    button.addEventListener("click", handler);
    return button;
}

// Requisito: exibir a lista de agendamentos com ações Editar e Excluir.
function renderAppointments() {
    appointmentList.textContent = "";
    emptyMessage.hidden = appointments.length > 0;

    appointments.forEach((appointment) => {
        const item = document.createElement("li");
        item.className = "agendamento-item";

        const name = document.createElement("h4");
        name.textContent = appointment.nome;

        const contact = document.createElement("p");
        contact.textContent = `Telefone: ${appointment.telefone}`;

        const details = document.createElement("p");
        details.textContent = `${appointment.modalidade} · ${formatDate(appointment.data)}`;

        const actions = document.createElement("div");
        actions.className = "agendamento-item__actions";
        actions.append(
            createActionButton("Editar", "agendamento-edit", () => startEditing(appointment)),
            createActionButton("Excluir", "agendamento-delete", () => deleteAppointment(appointment.id))
        );

        item.append(name, contact, details, actions);
        appointmentList.append(item);
    });
}

function resetForm() {
    editingId = null;
    form.reset();
    formTitle.textContent = "Novo agendamento";
    submitButton.textContent = "Agendar aula";
    cancelButton.hidden = true;
}

// Requisito: permitir editar um agendamento já exibido.
function startEditing(appointment) {
    editingId = appointment.id;
    form.elements.namedItem("nome").value = appointment.nome;
    form.elements.namedItem("telefone").value = appointment.telefone;
    form.elements.namedItem("modalidade").value = appointment.modalidade;
    form.elements.namedItem("data").value = appointment.data;
    formTitle.textContent = "Editar agendamento";
    submitButton.textContent = "Salvar alterações";
    cancelButton.hidden = false;
    form.elements.namedItem("nome").focus();
    setStatus("");
}

// Requisito: permitir excluir um agendamento e persistir a lista atualizada.
function deleteAppointment(id) {
    if (!window.confirm("Deseja excluir este agendamento?")) {
        return;
    }

    const nextAppointments = appointments.filter((appointment) => appointment.id !== id);
    if (saveAppointments(nextAppointments)) {
        appointments = nextAppointments;
        if (editingId === id) {
            resetForm();
        }
        renderAppointments();
        setStatus("Agendamento excluído.");
    }
}

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const appointmentData = {
        nome: form.elements.namedItem("nome").value.trim(),
        telefone: form.elements.namedItem("telefone").value.trim(),
        modalidade: form.elements.namedItem("modalidade").value,
        data: form.elements.namedItem("data").value
    };

    if (!Object.values(appointmentData).every(Boolean)) {
        setStatus("Preencha todos os campos para continuar.");
        return;
    }

    const isNewAppointment = editingId === null;

    // Requisito: cadastrar ou salvar os campos do formulário, mantendo os dados após recarregar.
    const nextAppointments = isNewAppointment
        ? [...appointments, { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, ...appointmentData }]
        : appointments.map((appointment) => (
            appointment.id === editingId
                ? { ...appointment, ...appointmentData }
                : appointment
        ));

    if (saveAppointments(nextAppointments)) {
        appointments = nextAppointments;
        renderAppointments();
        resetForm();

        if (isNewAppointment && whatsappContact) {
            const message = [
                "Olá! Gostaria de agendar uma aula experimental.",
                `Nome: ${appointmentData.nome}`,
                `Telefone: ${appointmentData.telefone}`,
                `Modalidade: ${appointmentData.modalidade}`,
                `Data desejada: ${formatDate(appointmentData.data)}`,
                "Poderiam confirmar o horário disponível?"
            ].join("\n");
            const whatsappUrl = new URL(whatsappContact.href);
            whatsappUrl.searchParams.set("text", message);
            window.open(whatsappUrl.toString(), "_blank", "noopener,noreferrer");
            setStatus("Agendamento salvo. Confira a mensagem no WhatsApp e envie para confirmar.");
        } else if (isNewAppointment) {
            setStatus("Agendamento salvo, mas não foi possível localizar o contato do CT Finger Team no WhatsApp.");
        } else {
            setStatus("Agendamento salvo.");
        }
    }
});

cancelButton.addEventListener("click", () => {
    resetForm();
    setStatus("Edição cancelada.");
});

const loadedAppointments = loadAppointments();
if (loadedAppointments !== null) {
    appointments = loadedAppointments;
    renderAppointments();
}
