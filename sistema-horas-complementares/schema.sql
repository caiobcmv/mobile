-- Database Schema Dump
-- Corrected to use standard BIGSERIAL declarations and drop statements for clean re-runs

-- Clean slate: Drop existing tables and types if they exist
DROP TABLE IF EXISTS audit_logs, categories, coordinator_profiles, course_activity_rules, course_coordinators, courses, notifications, roles, student_profiles, submission_files, submissions, user_courses, user_roles, users, validations CASCADE;
DROP TYPE IF EXISTS file_type_enum, notification_type_enum, submission_status_enum, user_status_enum, validation_status_enum CASCADE;

-- Enums
CREATE TYPE file_type_enum AS ENUM ('pdf', 'image', 'other');
CREATE TYPE notification_type_enum AS ENUM ('submission_created', 'submission_updated', 'submission_approved', 'submission_rejected', 'submission_returned', 'system_alert');
CREATE TYPE submission_status_enum AS ENUM ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'returned_for_adjustment');
CREATE TYPE user_status_enum AS ENUM ('active', 'inactive', 'blocked');
CREATE TYPE validation_status_enum AS ENUM ('approved', 'rejected', 'returned_for_adjustment');

-- Table: audit_logs
CREATE TABLE audit_logs (
  id BIGSERIAL,
  user_id bigint,
  action varchar(100) NOT NULL,
  entity_name varchar(100) NOT NULL,
  entity_id bigint,
  details jsonb,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- Table: categories
CREATE TABLE categories (
  id BIGSERIAL,
  name varchar(100) NOT NULL,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  peso_horas numeric DEFAULT 1.0,
  limite_max_horas integer DEFAULT 40,
  PRIMARY KEY (id)
);

-- Table: coordinator_profiles
CREATE TABLE coordinator_profiles (
  id BIGSERIAL,
  user_id bigint NOT NULL,
  departamento varchar(100),
  cargo varchar(100),
  data_nascimento date,
  data_admissao date,
  observacoes_internas text,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone,
  PRIMARY KEY (id)
);

-- Table: course_activity_rules
CREATE TABLE course_activity_rules (
  id BIGSERIAL,
  course_id bigint NOT NULL,
  category_id bigint NOT NULL,
  min_hours integer NOT NULL DEFAULT 0,
  max_hours integer NOT NULL DEFAULT 0,
  is_required boolean NOT NULL DEFAULT false,
  notes text,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone,
  PRIMARY KEY (id)
);

-- Table: course_coordinators
CREATE TABLE course_coordinators (
  id BIGSERIAL,
  user_id bigint NOT NULL,
  course_id bigint NOT NULL,
  assigned_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_active boolean NOT NULL DEFAULT true,
  PRIMARY KEY (id)
);

-- Table: courses
CREATE TABLE courses (
  id BIGSERIAL,
  name varchar(150) NOT NULL,
  code varchar(30) NOT NULL,
  minimum_required_hours integer NOT NULL DEFAULT 0,
  description text,
  modalidade varchar(30),
  turno varchar(30),
  semestres integer,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone,
  PRIMARY KEY (id)
);

-- Table: notifications
CREATE TABLE notifications (
  id BIGSERIAL,
  user_id bigint NOT NULL,
  submission_id bigint,
  type notification_type_enum NOT NULL,
  title varchar(150) NOT NULL,
  message text NOT NULL,
  sent_via_email boolean NOT NULL DEFAULT true,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  read_at timestamp without time zone,
  PRIMARY KEY (id)
);

-- Table: roles
CREATE TABLE roles (
  id BIGSERIAL,
  name varchar(50) NOT NULL,
  description varchar(255),
  PRIMARY KEY (id)
);

-- Table: student_profiles
CREATE TABLE student_profiles (
  id BIGSERIAL,
  user_id bigint NOT NULL,
  ra varchar(20),
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone,
  PRIMARY KEY (id)
);

-- Table: submission_files
CREATE TABLE submission_files (
  id BIGSERIAL,
  submission_id bigint NOT NULL,
  original_filename varchar(255) NOT NULL,
  storage_path varchar(500) NOT NULL,
  file_type file_type_enum NOT NULL DEFAULT 'pdf'::file_type_enum,
  mime_type varchar(100),
  file_size_kb integer,
  uploaded_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ocr_extracted_text text,
  ocr_confidence numeric,
  PRIMARY KEY (id)
);

-- Table: submissions
CREATE TABLE submissions (
  id BIGSERIAL,
  user_course_id bigint NOT NULL,
  category_id bigint NOT NULL,
  title varchar(200) NOT NULL,
  description text,
  activity_date date NOT NULL,
  submitted_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  requested_hours numeric NOT NULL,
  approved_hours numeric,
  status submission_status_enum NOT NULL DEFAULT 'submitted'::submission_status_enum,
  institution_name varchar(150),
  certificate_number varchar(100),
  organizer_name varchar(150),
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone,
  PRIMARY KEY (id)
);

-- Table: user_courses
CREATE TABLE user_courses (
  id BIGSERIAL,
  user_id bigint NOT NULL,
  course_id bigint NOT NULL,
  enrollment_date date NOT NULL DEFAULT CURRENT_DATE,
  status_matricula varchar(30) NOT NULL DEFAULT 'ativo'::character varying,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- Table: user_roles
CREATE TABLE user_roles (
  id BIGSERIAL,
  user_id bigint NOT NULL,
  role_id bigint NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- Table: users
CREATE TABLE users (
  id BIGSERIAL,
  full_name varchar(150) NOT NULL,
  email varchar(150) NOT NULL,
  password_hash varchar(255) NOT NULL,
  phone varchar(25),
  cpf varchar(20),
  status user_status_enum NOT NULL DEFAULT 'active'::user_status_enum,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone,
  last_login_at timestamp without time zone,
  PRIMARY KEY (id)
);

-- Table: validations
CREATE TABLE validations (
  id BIGSERIAL,
  submission_id bigint NOT NULL,
  validator_user_id bigint NOT NULL,
  validation_status validation_status_enum NOT NULL,
  previous_status submission_status_enum,
  comment text,
  validated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  approved_hours numeric,
  PRIMARY KEY (id)
);

-- Foreign Keys
ALTER TABLE user_roles ADD CONSTRAINT fk_user_roles_user_id FOREIGN KEY (user_id) REFERENCES users (id);
ALTER TABLE user_roles ADD CONSTRAINT fk_user_roles_role_id FOREIGN KEY (role_id) REFERENCES roles (id);
ALTER TABLE student_profiles ADD CONSTRAINT fk_student_profiles_user_id FOREIGN KEY (user_id) REFERENCES users (id);
ALTER TABLE coordinator_profiles ADD CONSTRAINT fk_coordinator_profiles_user_id FOREIGN KEY (user_id) REFERENCES users (id);
ALTER TABLE user_courses ADD CONSTRAINT fk_user_courses_user_id FOREIGN KEY (user_id) REFERENCES users (id);
ALTER TABLE user_courses ADD CONSTRAINT fk_user_courses_course_id FOREIGN KEY (course_id) REFERENCES courses (id);
ALTER TABLE course_coordinators ADD CONSTRAINT fk_course_coordinators_user_id FOREIGN KEY (user_id) REFERENCES users (id);
ALTER TABLE course_coordinators ADD CONSTRAINT fk_course_coordinators_course_id FOREIGN KEY (course_id) REFERENCES courses (id);
ALTER TABLE course_activity_rules ADD CONSTRAINT fk_course_activity_rules_course_id FOREIGN KEY (course_id) REFERENCES courses (id);
ALTER TABLE course_activity_rules ADD CONSTRAINT fk_course_activity_rules_category_id FOREIGN KEY (category_id) REFERENCES categories (id);
ALTER TABLE submissions ADD CONSTRAINT fk_submissions_user_course_id FOREIGN KEY (user_course_id) REFERENCES user_courses (id);
ALTER TABLE submissions ADD CONSTRAINT fk_submissions_category_id FOREIGN KEY (category_id) REFERENCES categories (id);
ALTER TABLE submission_files ADD CONSTRAINT fk_submission_files_submission_id FOREIGN KEY (submission_id) REFERENCES submissions (id);
ALTER TABLE validations ADD CONSTRAINT fk_validations_submission_id FOREIGN KEY (submission_id) REFERENCES submissions (id);
ALTER TABLE validations ADD CONSTRAINT fk_validations_validator_user_id FOREIGN KEY (validator_user_id) REFERENCES users (id);
ALTER TABLE notifications ADD CONSTRAINT fk_notifications_user_id FOREIGN KEY (user_id) REFERENCES users (id);
ALTER TABLE notifications ADD CONSTRAINT fk_notifications_submission_id FOREIGN KEY (submission_id) REFERENCES submissions (id);
ALTER TABLE audit_logs ADD CONSTRAINT fk_audit_logs_user_id FOREIGN KEY (user_id) REFERENCES users (id);

-- Seed Roles
INSERT INTO roles (name, description) VALUES 
('super_admin', 'Administrador Geral do Sistema'),
('coordinator', 'Coordenador de Curso'),
('student', 'Aluno');
