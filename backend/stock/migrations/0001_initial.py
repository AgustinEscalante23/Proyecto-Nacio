# Generated by Django 5.0.7 on 2024-09-24 22:48

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='categoria',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=30)),
            ],
        ),
        migrations.CreateModel(
            name='estado',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=30)),
            ],
        ),
        migrations.CreateModel(
            name='producto',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=30)),
                ('codigo', models.IntegerField(max_length=10)),
                ('descripcion', models.CharField(max_length=20)),
                ('categoria', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='stock.categoria')),
                ('estado', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='stock.estado')),
            ],
        ),
    ]
