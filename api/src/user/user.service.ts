import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from 'src/connection';
import { CreateCustomerDto } from './dto/create-user.dto';
import { Customer } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(@Inject(PG_CONNECTION) private connection: Pool) {}

  /* TODO: test implementation */
  async create(createCustomerDto: CreateCustomerDto) {
    const {
      lsu_id: lsuid,
      email,
      first_name: firstname,
      last_name: lastname,
      department,
      phone_number: phone,
      admin: admin,
    } = createCustomerDto;

    /* Query student by lsuid or email */
    const query = 'SELECT lsu_id FROM user WHERE lsu_id = $1 or email = $2';
    const queryRes = await this.connection.query(query, [lsuid, email]);

    /* Test to see if student exists */
    if (!!queryRes.rows[0]) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'LSUID and/or email already in system',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    /* Insert new student into db */
    const text =
      'INSERT INTO user (lsu_id, email, first_name, last_name, phone, department, admin) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
    const values = [
      lsuid,
      email,
      firstname,
      lastname,
      department,
      phone,
      admin,
    ];
    try {
      const res = await this.connection.query<Customer>(text, values);
      return res.rows[0];
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: error,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }
  /* TODO: Test implementation */
  async findAll() {
    try {
      const query = 'SELECT * FROM user';
      const queryRes = await this.connection.query<Customer>(query);

      /* If no customers found return empty array */
      if (queryRes.rows.length < 1) {
        return [];
      }

      return [...queryRes.rows];
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: error,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }
  /* TODO: Test implementation */
  async findOne(lsu_id: number) {
    try {
      const query = 'SELECT * FROM user WHERE lsu_id = $1';
      const queryRes = await this.connection.query<Customer>(query, [lsu_id]);

      /* If customer not found return empty object */
      if (queryRes.rows.length < 1) {
        return {};
      }

      return queryRes.rows[0];
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: error,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }
}
