--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4 (Debian 17.4-1.pgdg120+2)
-- Dumped by pg_dump version 17.0

-- Started on 2025-04-02 20:14:36 CEST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 16511)
-- Name: admin; Type: TABLE; Schema: public; Owner: clinic_admin
--

CREATE TABLE public.admin (
    id integer NOT NULL,
    user_id integer,
    name character varying(255),
    specialization character varying(255)
);


ALTER TABLE public.admin OWNER TO clinic_admin;

--
-- TOC entry 219 (class 1259 OID 16510)
-- Name: admin_id_seq; Type: SEQUENCE; Schema: public; Owner: clinic_admin
--

CREATE SEQUENCE public.admin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admin_id_seq OWNER TO clinic_admin;

--
-- TOC entry 3447 (class 0 OID 0)
-- Dependencies: 219
-- Name: admin_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: clinic_admin
--

ALTER SEQUENCE public.admin_id_seq OWNED BY public.admin.id;


--
-- TOC entry 226 (class 1259 OID 16557)
-- Name: appointments; Type: TABLE; Schema: public; Owner: clinic_admin
--

CREATE TABLE public.appointments (
    id integer NOT NULL,
    doctor_id integer,
    patient_id integer,
    appointment_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.appointments OWNER TO clinic_admin;

--
-- TOC entry 225 (class 1259 OID 16556)
-- Name: appointments_id_seq; Type: SEQUENCE; Schema: public; Owner: clinic_admin
--

CREATE SEQUENCE public.appointments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.appointments_id_seq OWNER TO clinic_admin;

--
-- TOC entry 3448 (class 0 OID 0)
-- Dependencies: 225
-- Name: appointments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: clinic_admin
--

ALTER SEQUENCE public.appointments_id_seq OWNED BY public.appointments.id;


--
-- TOC entry 222 (class 1259 OID 16527)
-- Name: doctors; Type: TABLE; Schema: public; Owner: clinic_admin
--

CREATE TABLE public.doctors (
    id integer NOT NULL,
    user_id integer,
    name character varying(255),
    specialization character varying(255)
);


ALTER TABLE public.doctors OWNER TO clinic_admin;

--
-- TOC entry 221 (class 1259 OID 16526)
-- Name: doctors_id_seq; Type: SEQUENCE; Schema: public; Owner: clinic_admin
--

CREATE SEQUENCE public.doctors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.doctors_id_seq OWNER TO clinic_admin;

--
-- TOC entry 3449 (class 0 OID 0)
-- Dependencies: 221
-- Name: doctors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: clinic_admin
--

ALTER SEQUENCE public.doctors_id_seq OWNED BY public.doctors.id;


--
-- TOC entry 224 (class 1259 OID 16543)
-- Name: patients; Type: TABLE; Schema: public; Owner: clinic_admin
--

CREATE TABLE public.patients (
    id integer NOT NULL,
    user_id integer,
    name character varying(255),
    age integer,
    appointment_date date
);


ALTER TABLE public.patients OWNER TO clinic_admin;

--
-- TOC entry 223 (class 1259 OID 16542)
-- Name: patients_id_seq; Type: SEQUENCE; Schema: public; Owner: clinic_admin
--

CREATE SEQUENCE public.patients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.patients_id_seq OWNER TO clinic_admin;

--
-- TOC entry 3450 (class 0 OID 0)
-- Dependencies: 223
-- Name: patients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: clinic_admin
--

ALTER SEQUENCE public.patients_id_seq OWNED BY public.patients.id;


--
-- TOC entry 228 (class 1259 OID 16576)
-- Name: prescriptions; Type: TABLE; Schema: public; Owner: clinic_admin
--

CREATE TABLE public.prescriptions (
    id integer NOT NULL,
    doctor_id integer,
    patient_id integer,
    medication character varying(255) NOT NULL,
    dosage character varying(50) NOT NULL,
    instructions text NOT NULL,
    prescribed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.prescriptions OWNER TO clinic_admin;

--
-- TOC entry 227 (class 1259 OID 16575)
-- Name: prescriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: clinic_admin
--

CREATE SEQUENCE public.prescriptions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.prescriptions_id_seq OWNER TO clinic_admin;

--
-- TOC entry 3451 (class 0 OID 0)
-- Dependencies: 227
-- Name: prescriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: clinic_admin
--

ALTER SEQUENCE public.prescriptions_id_seq OWNED BY public.prescriptions.id;


--
-- TOC entry 230 (class 1259 OID 16596)
-- Name: treatments; Type: TABLE; Schema: public; Owner: clinic_admin
--

CREATE TABLE public.treatments (
    id integer NOT NULL,
    patient_id integer,
    treatment_type character varying(255) NOT NULL,
    description text,
    start_date date NOT NULL,
    end_date date
);


ALTER TABLE public.treatments OWNER TO clinic_admin;

--
-- TOC entry 229 (class 1259 OID 16595)
-- Name: treatments_id_seq; Type: SEQUENCE; Schema: public; Owner: clinic_admin
--

CREATE SEQUENCE public.treatments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.treatments_id_seq OWNER TO clinic_admin;

--
-- TOC entry 3452 (class 0 OID 0)
-- Dependencies: 229
-- Name: treatments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: clinic_admin
--

ALTER SEQUENCE public.treatments_id_seq OWNED BY public.treatments.id;


--
-- TOC entry 218 (class 1259 OID 16496)
-- Name: users; Type: TABLE; Schema: public; Owner: clinic_admin
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username character varying(50) NOT NULL,
    password_hash character varying(255) NOT NULL,
    email character varying(100) NOT NULL,
    full_name character varying(100),
    phone_number character varying(15),
    role character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'patient'::character varying, 'doctor'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO clinic_admin;

--
-- TOC entry 217 (class 1259 OID 16495)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: clinic_admin
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO clinic_admin;

--
-- TOC entry 3453 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: clinic_admin
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- TOC entry 3242 (class 2604 OID 16514)
-- Name: admin id; Type: DEFAULT; Schema: public; Owner: clinic_admin
--

ALTER TABLE ONLY public.admin ALTER COLUMN id SET DEFAULT nextval('public.admin_id_seq'::regclass);


--
-- TOC entry 3245 (class 2604 OID 16560)
-- Name: appointments id; Type: DEFAULT; Schema: public; Owner: clinic_admin
--

ALTER TABLE ONLY public.appointments ALTER COLUMN id SET DEFAULT nextval('public.appointments_id_seq'::regclass);


--
-- TOC entry 3243 (class 2604 OID 16530)
-- Name: doctors id; Type: DEFAULT; Schema: public; Owner: clinic_admin
--

ALTER TABLE ONLY public.doctors ALTER COLUMN id SET DEFAULT nextval('public.doctors_id_seq'::regclass);


--
-- TOC entry 3244 (class 2604 OID 16546)
-- Name: patients id; Type: DEFAULT; Schema: public; Owner: clinic_admin
--

ALTER TABLE ONLY public.patients ALTER COLUMN id SET DEFAULT nextval('public.patients_id_seq'::regclass);


--
-- TOC entry 3247 (class 2604 OID 16579)
-- Name: prescriptions id; Type: DEFAULT; Schema: public; Owner: clinic_admin
--

ALTER TABLE ONLY public.prescriptions ALTER COLUMN id SET DEFAULT nextval('public.prescriptions_id_seq'::regclass);


--
-- TOC entry 3249 (class 2604 OID 16599)
-- Name: treatments id; Type: DEFAULT; Schema: public; Owner: clinic_admin
--

ALTER TABLE ONLY public.treatments ALTER COLUMN id SET DEFAULT nextval('public.treatments_id_seq'::regclass);


--
-- TOC entry 3240 (class 2604 OID 16499)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: clinic_admin
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- TOC entry 3431 (class 0 OID 16511)
-- Dependencies: 220
-- Data for Name: admin; Type: TABLE DATA; Schema: public; Owner: clinic_admin
--

COPY public.admin (id, user_id, name, specialization) FROM stdin;
1	1	Admin One	System Management
\.


--
-- TOC entry 3437 (class 0 OID 16557)
-- Dependencies: 226
-- Data for Name: appointments; Type: TABLE DATA; Schema: public; Owner: clinic_admin
--

COPY public.appointments (id, doctor_id, patient_id, appointment_date) FROM stdin;
\.


--
-- TOC entry 3433 (class 0 OID 16527)
-- Dependencies: 222
-- Data for Name: doctors; Type: TABLE DATA; Schema: public; Owner: clinic_admin
--

COPY public.doctors (id, user_id, name, specialization) FROM stdin;
1	2	Doctor 1	Specialization 1
2	3	Doctor 2	Specialization 2
3	4	Doctor 3	Specialization 3
4	12	Dr. Smith	General Medicine
\.


--
-- TOC entry 3435 (class 0 OID 16543)
-- Dependencies: 224
-- Data for Name: patients; Type: TABLE DATA; Schema: public; Owner: clinic_admin
--

COPY public.patients (id, user_id, name, age, appointment_date) FROM stdin;
1	5	Patient 1	21	2025-04-10
2	6	Patient 2	22	2025-04-10
3	7	Patient 3	23	2025-04-10
\.


--
-- TOC entry 3439 (class 0 OID 16576)
-- Dependencies: 228
-- Data for Name: prescriptions; Type: TABLE DATA; Schema: public; Owner: clinic_admin
--

COPY public.prescriptions (id, doctor_id, patient_id, medication, dosage, instructions, prescribed_at) FROM stdin;
\.


--
-- TOC entry 3441 (class 0 OID 16596)
-- Dependencies: 230
-- Data for Name: treatments; Type: TABLE DATA; Schema: public; Owner: clinic_admin
--

COPY public.treatments (id, patient_id, treatment_type, description, start_date, end_date) FROM stdin;
\.


--
-- TOC entry 3429 (class 0 OID 16496)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: clinic_admin
--

COPY public.users (user_id, username, password_hash, email, full_name, phone_number, role, created_at) FROM stdin;
1	admin1	hashed_password	admin@example.com	Admin One	\N	admin	2025-04-01 12:36:51.949117
2	doctor1	hashed_password	doctor1@example.com	Doctor 1	\N	doctor	2025-04-01 12:36:51.958291
3	doctor2	hashed_password	doctor2@example.com	Doctor 2	\N	doctor	2025-04-01 12:36:51.963617
4	doctor3	hashed_password	doctor3@example.com	Doctor 3	\N	doctor	2025-04-01 12:36:51.967377
5	patient1	hashed_password	patient1@example.com	Patient 1	\N	patient	2025-04-01 12:36:51.970727
6	patient2	hashed_password	patient2@example.com	Patient 2	\N	patient	2025-04-01 12:36:51.974798
7	patient3	hashed_password	patient3@example.com	Patient 3	\N	patient	2025-04-01 12:36:51.977944
12	test	$2b$10$u8DZkHYuourrKhlioNGSduduhl3eStjW1kN/GIaNuPYiEZm.dujpW	test@example.com	Dr. Smith	123456789	doctor	2025-04-02 11:37:33.177065
13	test1	$2b$10$nmLLjLIVwNbTqC3AsSBBAexjbEc2H8yfOZJunaFX8LRGf2.b1Rppi	test1@example.com	Dr. Smith	123456789	doctor	2025-04-02 11:43:04.342645
14	test2	$2b$10$4U71iXhCv4N4TJwH9cdJjelXQesNR/p9AqwrSm0h/93qR87ZY43vq	test2@example.com	\N	\N	patient	2025-04-02 12:04:33.162116
\.


--
-- TOC entry 3454 (class 0 OID 0)
-- Dependencies: 219
-- Name: admin_id_seq; Type: SEQUENCE SET; Schema: public; Owner: clinic_admin
--

SELECT pg_catalog.setval('public.admin_id_seq', 1, true);


--
-- TOC entry 3455 (class 0 OID 0)
-- Dependencies: 225
-- Name: appointments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: clinic_admin
--

SELECT pg_catalog.setval('public.appointments_id_seq', 1, false);


--
-- TOC entry 3456 (class 0 OID 0)
-- Dependencies: 221
-- Name: doctors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: clinic_admin
--

SELECT pg_catalog.setval('public.doctors_id_seq', 4, true);


--
-- TOC entry 3457 (class 0 OID 0)
-- Dependencies: 223
-- Name: patients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: clinic_admin
--

SELECT pg_catalog.setval('public.patients_id_seq', 3, true);


--
-- TOC entry 3458 (class 0 OID 0)
-- Dependencies: 227
-- Name: prescriptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: clinic_admin
--

SELECT pg_catalog.setval('public.prescriptions_id_seq', 1, true);


--
-- TOC entry 3459 (class 0 OID 0)
-- Dependencies: 229
-- Name: treatments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: clinic_admin
--

SELECT pg_catalog.setval('public.treatments_id_seq', 1, false);


--
-- TOC entry 3460 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: clinic_admin
--

SELECT pg_catalog.setval('public.users_user_id_seq', 14, true);


--
-- TOC entry 3258 (class 2606 OID 16518)
-- Name: admin admin_pkey; Type: CONSTRAINT; Schema: public; Owner: clinic_admin
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_pkey PRIMARY KEY (id);


--
-- TOC entry 3260 (class 2606 OID 16520)
-- Name: admin admin_user_id_key; Type: CONSTRAINT; Schema: public; Owner: clinic_admin
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_user_id_key UNIQUE (user_id);


--
-- TOC entry 3270 (class 2606 OID 16563)
-- Name: appointments appointments_pkey; Type: CONSTRAINT; Schema: public; Owner: clinic_admin
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_pkey PRIMARY KEY (id);


--
-- TOC entry 3262 (class 2606 OID 16534)
-- Name: doctors doctors_pkey; Type: CONSTRAINT; Schema: public; Owner: clinic_admin
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_pkey PRIMARY KEY (id);


--
-- TOC entry 3264 (class 2606 OID 16536)
-- Name: doctors doctors_user_id_key; Type: CONSTRAINT; Schema: public; Owner: clinic_admin
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_user_id_key UNIQUE (user_id);


--
-- TOC entry 3266 (class 2606 OID 16548)
-- Name: patients patients_pkey; Type: CONSTRAINT; Schema: public; Owner: clinic_admin
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_pkey PRIMARY KEY (id);


--
-- TOC entry 3268 (class 2606 OID 16550)
-- Name: patients patients_user_id_key; Type: CONSTRAINT; Schema: public; Owner: clinic_admin
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_user_id_key UNIQUE (user_id);


--
-- TOC entry 3272 (class 2606 OID 16584)
-- Name: prescriptions prescriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: clinic_admin
--

ALTER TABLE ONLY public.prescriptions
    ADD CONSTRAINT prescriptions_pkey PRIMARY KEY (id);


--
-- TOC entry 3274 (class 2606 OID 16603)
-- Name: treatments treatments_pkey; Type: CONSTRAINT; Schema: public; Owner: clinic_admin
--

ALTER TABLE ONLY public.treatments
    ADD CONSTRAINT treatments_pkey PRIMARY KEY (id);


--
-- TOC entry 3252 (class 2606 OID 16509)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: clinic_admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3254 (class 2606 OID 16505)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: clinic_admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 3256 (class 2606 OID 16507)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: clinic_admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 3275 (class 2606 OID 16521)
-- Name: admin admin_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: clinic_admin
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3278 (class 2606 OID 16564)
-- Name: appointments appointments_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: clinic_admin
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(id) ON DELETE CASCADE;


--
-- TOC entry 3279 (class 2606 OID 16569)
-- Name: appointments appointments_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: clinic_admin
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;


--
-- TOC entry 3276 (class 2606 OID 16537)
-- Name: doctors doctors_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: clinic_admin
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3277 (class 2606 OID 16551)
-- Name: patients patients_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: clinic_admin
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3280 (class 2606 OID 16585)
-- Name: prescriptions prescriptions_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: clinic_admin
--

ALTER TABLE ONLY public.prescriptions
    ADD CONSTRAINT prescriptions_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(id) ON DELETE CASCADE;


--
-- TOC entry 3281 (class 2606 OID 16590)
-- Name: prescriptions prescriptions_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: clinic_admin
--

ALTER TABLE ONLY public.prescriptions
    ADD CONSTRAINT prescriptions_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;


--
-- TOC entry 3282 (class 2606 OID 16604)
-- Name: treatments treatments_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: clinic_admin
--

ALTER TABLE ONLY public.treatments
    ADD CONSTRAINT treatments_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;


-- Completed on 2025-04-02 20:14:36 CEST

--
-- PostgreSQL database dump complete
--

