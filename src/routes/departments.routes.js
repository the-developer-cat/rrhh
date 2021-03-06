const express = require('express')
const router = express.Router();
const DB = require('../db')

// GET /api/v1/departamentos
router.get('/', async (req, res) => {
    const deptos = await DB.Departmens.getAll();
    res.status(200).json(deptos)
});

// GET /api/v1/departamentos/:id
router.get('/:id', async (req, res) => {
    const depto = await DB.Departmens.getById(req.params.id);
    if (depto) {
        res.status(200).json(depto)
    } else {
        res.status(404).send('Departamento no encontrado!!!')
    }
});

// GET /api/v1/departamentos/:id/manager
router.get('/:id/manager', async (req, res) => {
    const depto = await DB.Departmens.getById(req.params.id);
    if (!depto) {
        res.status(404).send('Departamento no encontrado!!!')
        return
    }
    const manager = await DB.Departmens.getActualManager(depto);
    res.status(200).json(manager)
});

// POST /api/v1/departamentos
router.post('/', async (req, res) => {
    const { dept_no, dept_name } = req.body
    if (!dept_no) {
        res.status(400).send('dept_no es Requerido!!!')
        return
    }
    if (!dept_name) {
        res.status(400).send('dept_name es Requerido!!!')
        return
    }
    const depto = await DB.Departmens.getById(dept_no);
    if (depto) {
        res.status(500).send('ya existe el Departamento !!!')
        return
    }
    const deptoNuevo = { dept_no, dept_name }
    const isAddOk = await DB.Departmens.add(deptoNuevo)
    if (isAddOk) {
        res.status(201).json(deptoNuevo)
    } else {
        res.status(500).send('Falló al agregar el departamento!!!')
    }
});

// PUT /api/v1/departamentos/:id
router.put('/:id', async (req, res) => {
    const { dept_name } = req.body
    if (!dept_name) {
        res.status(400).send('dept_name es Requerido!!!')
        return
    }
    const depto = await DB.Departmens.getById(req.params.id);
    if (!depto) {
        res.status(404).send('Departamento no encontrado!!!')
        return
    }
    depto.dept_name = dept_name
    const isUpdateOk = await DB.Departmens.update(depto)
    if (isUpdateOk) {
        res.status(200).json(depto)
    } else {
        res.status(500).send('Falló al modificar el departamento!!!')
    }
});

// DELETE /api/v1/departamentos/:id
router.delete('/:id', async (req, res) => {
    const depto = await DB.Departmens.getById(req.params.id);
    if (!depto) {
        res.status(404).send('Departamento no encontrado!!!')
        return
    }
    const isDeleteOk = await DB.Departmens.delete(depto)
    if (isDeleteOk) {
        res.status(204).send()
    } else {
        res.status(500).send('Falló al eliminar el departamento!!!')
    }
});

// GET /api/v1/departamentos/:id/employees
router.get('/:id/employees', async (req, res) => {
    console.log("en el metodo getAllEmpByDept")
    const depto = await DB.Departmens.getById(req.params.id);
    if (!depto) {
        res.status(404).send('Departamento no encontrado!!!')
        return
    }
    const employees = await DB.Departmens.getAllEmpByDept(depto);
    res.status(200).json(employees)
});

// GET /api/v1/departamentos/empleado/:id/salario
router.get('/empleado/:id/salario', async (req, res) => {
    console.log("en la ruta hacia el metodo getSalaryByEmpNumber");
    const emp = await DB.Departmens.getEmpById(req.params.id);
    if (!emp) {
        res.status(404).send('Empleado no encontrado!!!')
        return
    }
    const salaries = await DB.Departmens.getSalaryByEmpNumber(emp);
    res.status(200).json(salaries);
})

router.put('/empleado/:id/salario', async (req, res) => {
    console.log("en el metodo para actualizar salario")

    const { salary } = req.body
    if (!salary) {
        res.status(400).send('salary es Requerido!!!')
        return
    }
    const emp = await DB.Departmens.getEmpById(req.params.id);
    console.log(JSON.stringify(emp))
    if (!emp) {
        res.status(404).send('Empleado no encontrado!!!')
        return
    }

    const salaries = await DB.Departmens.getSalaryByEmpNumber(emp);
    if (!salaries) {
        res.status(404).send('El empleado no posee salarios!!!')
        return
    }

    salaries[salaries.length - 1].salary = salary;

    const isUpdateOk = await DB.Departmens.updateSalary(salaries[salaries.length - 1])
    if (isUpdateOk) {
        res.status(200).json(salaries[salaries.length - 1])
    } else {
        res.status(500).send('Falló al modificar el salario del empleado!!!')
    }
});

// GET /api/v1/empleado/:id
router.get('/empleado/:id', async (req, res) => {
    const emp = await DB.Departmens.getEmpById(req.params.id);
    if (emp) {
        res.status(200).json(emp)
    } else {
        res.status(404).send('Empleado no encontrado!!!')
    }
});


// GET /api/v1/departamentos/empleado/:id/departamento
router.get('/empleado/:id/departamento', async (req, res) => {
    console.log("en la ruta hacia el metodo getDept..");
    const emp = await DB.Departmens.getEmpById(req.params.id);
    if (!emp) {
        res.status(404).send('Empleado no encontrado!!!')
        return
    }
    const dept = await DB.Departmens.getDeptByEmpNumber(emp);
    res.status(200).json(dept);
})

// PUT /api/v1/departamentos/empleado/:id/departamento
router.put('/empleado/:id/departamento', async (req, res) => {
    console.log("en el metodo para actualizar el departamento de un empleado")

    const { dept_no } = req.body
    if (!dept_no) {
        res.status(400).send('dept_no es Requerido!!!')
        return
    }
    const emp = await DB.Departmens.getEmpById(req.params.id);
    console.log(JSON.stringify(emp))
    if (!emp) {
        res.status(404).send('Empleado no encontrado!!!')
        return
    }

    const departments = await DB.Departmens.getDeptByEmpNumber(emp);
    if (!departments) {
        res.status(404).send('El empleado no tiene departamentos!!!')
        return
    }

    departments[departments.length - 1].dept_no = dept_no;

    const isUpdateOk = await DB.Departmens.updateDepartment(departments[departments.length - 1])
    if (isUpdateOk) {
        res.status(200).json(departments[departments.length - 1])
    } else {
        res.status(500).send('Falló al modificar el depto del empleado!!!')
    }
});

// PUT /api/v1/manager/:id/departamento
router.put('/manager/:id/departamento', async (req, res) => {
    console.log("en el metodo para actualizar el departamento de un jefe")

    const { dept_no } = req.body
    if (!dept_no) {
        res.status(400).send('dept_no es Requerido!!!')
        return
    }
    const emp = await DB.Departmens.getEmpById(req.params.id);
    console.log(JSON.stringify(emp))
    if (!emp) {
        res.status(404).send('Empleado no encontrado!!!')
        return
    }

    const departments = await DB.Departmens.getDeptByEmpNumber(emp);
    if (!departments) {
        res.status(404).send('El empleado no tiene departamentos!!!')
        return
    }

    departments[departments.length - 1].dept_no = dept_no;

    const isUpdateOk = await DB.Departmens.updateManagerDepartment(departments[departments.length - 1])
    if (isUpdateOk) {
        res.status(200).json(departments[departments.length - 1])
    } else {
        res.status(500).send('Falló al modificar el depto del empleado!!!')
    }
});



module.exports = router